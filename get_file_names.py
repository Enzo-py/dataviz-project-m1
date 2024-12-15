import os

def get_file_names(path, text_format=False):
    files = sorted([os.path.join(path, f) for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))])
    if not text_format:
        return files
    
    return "[\n'" + "',\n'".join(files) + "'\n]"

print(get_file_names('./data/players/', text_format=True))