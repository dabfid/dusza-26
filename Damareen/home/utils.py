from pathlib import Path
from django.conf import settings

def get_static_images(folder_name):
    if settings.STATIC_ROOT:
        images_path = Path(settings.STATIC_ROOT) / folder_name
        if images_path.exists():
            return list_images(images_path, folder_name)
    
    images_path = Path(settings.BASE_DIR) / 'static' / folder_name
    if images_path.exists():
        return list_images(images_path, folder_name)
    
    return []

def list_images(path, relative_path):
    image_extensions = {'.png'}
    result = []
    for f in path.iterdir():
        if f.is_file() and f.suffix.lower() in image_extensions:
            result.append(relative_path + "/" + f.name)
    return result