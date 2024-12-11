const ctx = {
    MAP_W: window.innerWidth,
    MAP_H: window.innerHeight + 40,
    proj: null,
    showLogos: true,
}

const countryWallpapers = {
    "FR": "img/wallpaper/france.png",
    "ES": "img/wallpaper/spain.png",
    "DE": "img/wallpaper/germany.jpg",
    "IT": "img/wallpaper/italy.webp",
    "UK": "img/wallpaper/uk.png"
};

function create_graph_layout() {
    const map = d3.select(".map")
        .append("svg")
        .attr("width", ctx.MAP_W)
        .attr("height", ctx.MAP_H);

    load_data();
    create_toggle_button();
}

function create_toggle_button() {
    const toggleButton = d3.select("menu.right")
        .append("div")
        .attr("class", "toggle-button")
        .on("click", toggle_rendering);

    toggleButton.append("span").text("Toggle Rendering");
}

function toggle_rendering() {
    ctx.showLogos = !ctx.showLogos;
    d3.select(".toggle-button").classed("active", ctx.showLogos);
    render_map();
}

function load_data() {
    const files = [
        "data/map/nutsbn.geojson", 
        "data/map/nutsrg.geojson",
        "data/clubs_cities.csv",
        "data/map/cities.geojson",
        "data/clubs_logo.csv",
        "data/map/all.geojson"
    ]

    const promises = files.map(url => url.includes("json") ? d3.json(url) : d3.csv(url))

    Promise.all(promises).then(data => {
        mapped_data = {}
        data.forEach((d, i) => {
            file_name = files[i].split("/").slice(-1)[0].split(".")[0]
            if (mapped_data[file_name] != undefined) {
                console.warn("File name <", file_name, "> already exists, renaming to:", file_name + i)
                file_name += i
            }
            mapped_data[file_name] = d
        })
        ctx.data = mapped_data
        render_map()
    }).catch(error => console.error("Error loading the data:", error))
}

function city_event(event, city_name) {
    city_name = city_name_to_id(city_name)
    let logo = d3.select(".logo-city#" + city_name)

    if (event.type == "click") {
        logo.node().classList.toggle("force-active")
        d3.selectAll(".logo-city").nodes().forEach(node => {
            if (node != logo.node()) node.classList.remove("force-active", "active")
        })

    } else if (event.type == "mouseenter") {
        if (d3.selectAll(".logo-city.force-active").nodes().length != 0) return
        logo.node().classList.add("active")

    } else if (event.type == "mouseleave") {
        if (d3.selectAll(".logo-city.force-active").nodes().length != 0) return
        logo.node().classList.remove("active")
    }
}
    
function render_map() {
    wanted_cities_names = ctx.data["clubs_cities"].map(d => d.City.toLowerCase())

    // create new attr: NAME
    ctx.data["cities"].features.forEach(d => {
        d.properties.NAME = d.properties.NUTS_NAME ? d.properties.NUTS_NAME : d.properties.COMM_NAME
    })

    ctx.data["cities"].features = ctx.data["cities"].features.filter(d => wanted_cities_names.includes(d.properties.NAME.toLowerCase()))
    finded_cities = ctx.data["cities"].features.map(d => d.properties.NAME.toLowerCase())
    wanted_cities_names = wanted_cities_names.filter(d => !finded_cities.includes(d))
    wanted_cities_names = new Set(wanted_cities_names.sort())
    if (wanted_cities_names.size > 0) console.warn("Not found cities:", wanted_cities_names)

    wanted_countries = ["ES", "PT", "FR", "IT", "DE", "BE", "UK", "NL", "IE", "LU", "CH"]
    ctx.data["map-focus"] = JSON.parse(JSON.stringify(ctx.data["nutsrg"]))
    ctx.data["map-focus"].features = ctx.data["nutsrg"].features.filter(d => wanted_countries.includes(d.properties.id.slice(0, 2)))

    ctx.proj = d3.geoIdentity()
        .reflectY(true)
        .fitSize([ctx.MAP_W, ctx.MAP_H], ctx.data["map-focus"])

    const countriesWithGlow = ["FR", "ES", "DE", "IT", "UK"];
    ctx.path = d3.geoPath(ctx.proj);
    d3.select(".map svg").append("g")
        .attr("id", "countries-area")
        .selectAll("path")
        .data(ctx.data["all"].features)
        .enter()
        .append("path")
        .attr("d", ctx.path)
        .attr("fill", "var(--earth-color)")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .on("mouseover", function(event, d) {
            if (d.properties.CNTR_ID && countriesWithGlow.includes(d.properties.CNTR_ID.slice(0, 2))) {
                d3.select(this).classed("glow", true);
            }
            const countryCode = d.properties.CNTR_ID.slice(0, 2);
            if (countryWallpapers[countryCode]) {
                document.body.style.backgroundImage = `url(${countryWallpapers[countryCode]})`;
            }
        })
        .on("mouseout", function(event, d) {
            if (d.properties.CNTR_ID && countriesWithGlow.includes(d.properties.CNTR_ID.slice(0, 2))) {
                d3.select(this).classed("glow", false);
            }
            document.body.style.backgroundImage = "";
        });

    d3.select("#cities").remove();

    if (ctx.showLogos) {
        d3.select(".map svg").append("g")
            .attr("id", "cities")
            .selectAll("g")
            .data(ctx.data["cities"].features)
            .enter()
            .append("g")
            .attr("transform", d => {
                const [x, y] = ctx.proj([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
                return `translate(${x}, ${y})`;
            })
            .each(function(d) {
                const cityGroup = d3.select(this);
                const clubs = ctx.data["clubs_cities"].filter(c => c.City.toLowerCase() === d.properties.NAME.toLowerCase());

                if (clubs.length > 1) {
                    cityGroup.append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", 6)
                        .attr("fill", "green")
                        .style("cursor", "pointer")
                        .on("click", (event) => city_event(event, d.properties.NAME))
                        .on("mouseenter", (event) => city_event(event, d.properties.NAME))
                        .on("mouseleave", (event) => city_event(event, d.properties.NAME))
                        .append("title")
                        .text(d => d.properties.NAME.slice(0, 1).toUpperCase() + d.properties.NAME.toLowerCase().slice(1));
                } else if (clubs.length === 1) {
                    const club = clubs[0];
                    const club_logo = ctx.data["clubs_logo"].find(e => e.Club === club.Club);
                    const logoURL = club_logo ? club_logo.Logo_URL : 'default/path/to/default-icon.svg';

                    cityGroup.append("image")
                        .attr("xlink:href", logoURL)
                        .attr("x", -10)
                        .attr("y", -10)
                        .attr("width", 20)
                        .attr("height", 20)
                        .style("cursor", "pointer")
                        .on("click", (event) => city_event(event, d.properties.NAME))
                        .on("mouseenter", (event, d) => city_event(event, d.properties.NAME))
                        .on("mouseleave", (event, d) => city_event(event, d.properties.NAME))
                        .append("title")
                        .text(d => d.properties.NAME.slice(0, 1).toUpperCase() + d.properties.NAME.toLowerCase().slice(1));
                }
            });
    } else {
        d3.select(".map svg").append("g")
            .attr("id", "cities")
            .selectAll("path")
            .data(ctx.data["cities"].features)
            .enter()
            .append("path")
            .attr("d", ctx.path)
            .attr("fill", "transparent")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .attr("name", d => d.properties.NAME.toLowerCase())
            .on("click", (event, d) => city_event(event, d.properties.NAME))
            .on("mouseenter", (event, d) => city_event(event, d.properties.NAME))
            .on("mouseleave", (event, d) => city_event(event, d.properties.NAME))
            .append("title")
            .text(d => d.properties.NAME.slice(0, 1).toUpperCase() + d.properties.NAME.toLowerCase().slice(1));
    }

    // ajout de las palmas (hors carte)
    d3.select(".map").append("div")
        .attr("class", "extra-cities")
        .append("div")
        .attr("class", "las-palmas")
        .append("span")
        .attr("name", "las palmas")
        .on("click", event => city_event(event, "Las Palmas"))
        .on("mouseenter", event => city_event(event, "Las Palmas"))
        .on("mouseleave", event => city_event(event, "Las Palmas"))
        .attr("title", "Las Palmas")

    window.addEventListener('resize', update_map);

    let logos_wrapper = d3.select("main").append("div")
        .attr("class", "logo-wrapper")
    
    ctx.data["clubs_cities"].forEach(d => {
        let club_logo = ctx.data["clubs_logo"].filter(e => e.Club == d.Club)[0]
        city_name = city_name_to_id(d.City)

        // logo storage
        logos_city = logos_wrapper.select("#" + city_name.toLowerCase() + " .imgs-wrapper")
        if (logos_city.empty()) {
            logos_city = logos_wrapper.append("div")
                .attr("id", city_name)
                .attr("class", "logo-city")
                .append("h3")
                .text(d.City)
                .select(function() { return this.parentNode })
                .append("div")
                .attr("class", "imgs-wrapper")
        }
        logos_city.append("img") // Logo_URL
            .attr("src", club_logo.Logo_URL)
            .attr("alt", d.Club)
            .attr("title", d.Club)
            .attr("class", "club-logo")
    })

    // populate datalist for search
    let datalist = d3.select("main #search-list")
    cities = Array.from(new Set(ctx.data["clubs_cities"].map(d => d.City))).sort()
    cities.forEach(city => {
        datalist.append("option")
            .attr("value", city)
            .attr("name", "city")
    })

    clubs = Array.from(new Set(ctx.data["clubs_cities"].map(d => d.Club))).sort()
    clubs.forEach(club => {
        datalist.append("option")
            .attr("value", club)
            .attr("name", "club")
    })
}

function city_name_to_id(city_name) {
    city_name = city_name.toLowerCase().split(" ").join("-").split("/")[0]
    allowed_chars = "abcdefghijklmnopqrstuvwxyz-"
    city_name = city_name.split("").filter(c => allowed_chars.includes(c)).join("")
    return city_name
}

function update_map() {
    ctx.MAP_W = window.innerWidth;
    ctx.MAP_H = window.innerHeight + 40;

    d3.select(".map svg")
        .attr("width", ctx.MAP_W)
        .attr("height", ctx.MAP_H);

    ctx.proj.fitSize([ctx.MAP_W, ctx.MAP_H], ctx.data["map-focus"]);

    d3.select("#countries-area")
        .selectAll("path")
        .attr("d", ctx.path)

    d3.select("#countries-borders")
        .selectAll("path")
        .attr("d", ctx.path)

    d3.select("#cities")
        .selectAll("path")
        .attr("d", ctx.path)
}

function search(event, input) {
    if (event.key != "Enter" && event.type != "click") return
    let search = input.value.toLowerCase()
    
    let possible_cities = ctx.data["clubs_cities"].filter(d => d.City.toLowerCase() == search)
    let possible_clubs = ctx.data["clubs_cities"].filter(d => d.Club.toLowerCase() == search)

    if (possible_cities.length > 0) {
        city_name = city_name_to_id(possible_cities[0].City)
        city_event({type: "click"}, city_name)

        input.classList.add("found")
        setTimeout(() => input.classList.remove("found"), 500)

        if (d3.select(`#cities path[name='${possible_cities[0].City.toLowerCase()}']`).empty()) {
            let node = d3.select(`.extra-cities .${city_name}`).node()
            if (node == null) return
            node.classList.add("found")
            setTimeout(() => node.classList.remove("found"), 2000)
            return
        }
        d3.select(`#cities path[name='${possible_cities[0].City.toLowerCase()}']`)
            .transition()
            .duration(500)
            .attr("stroke", "darkgreen")
            .attr("stroke-width", 15)
            .transition()
            .duration(500)
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .transition()
            .duration(500)
            .attr("stroke", "darkgreen")
            .attr("stroke-width", 15)
            .transition()
            .duration(500)
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)

        return
    }
    if (possible_clubs.length > 0) {
        console.log("Club:", possible_clubs[0].Club)
        return
    }

    // animation input not found
    input.classList.add("not-found")
    setTimeout(() => input.classList.remove("not-found"), 500)
}
