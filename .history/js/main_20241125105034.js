const ctx = {
    MAP_W: window.innerWidth,
    MAP_H: window.innerHeight + 40,
    proj: null,
}

function create_graph_layout() {
    const map = d3.select(".map")
        .append("svg")
        .attr("width", ctx.MAP_W)
        .attr("height", ctx.MAP_H);

    load_data();
}

function load_data() {
    const files = [
        "data/map/nutsbn.geojson", 
        "data/map/nutsrg.geojson",
        "data/clubs_cities.csv",
        "data/club_ci"
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
        .text(d => d.properties.NAME.slice(0, 1).toUpperCase() + d.properties.NAME.toLowerCase().slice(1))
    
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
    if (event.key != "Enter") return
    let search = input.value.toLowerCase()
    
    let possible_cities = ctx.data["clubs_cities"].filter(d => d.City.toLowerCase() == search)
    let possible_clubs = ctx.data["clubs_cities"].filter(d => d.Club.toLowerCase() == search)

    if (possible_cities.length > 0) {
        city_name = city_name_to_id(possible_cities[0].City)
        city_event({type: "click"}, possible_cities[0].City)
        input.classList.add("found")
        setTimeout(() => input.classList.remove("found"), 500)
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
