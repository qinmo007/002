import os
import sys

def list_files(path):
    print(f"Listing files in: {path}")
    print("-" * 50)

    try:
        for item in os.listdir(path):
            full_path = os.path.join(path, item)
            if os.path.isdir(full_path):
                print(f"[DIR] {item}")
            else:
                print(f"[FILE] {item}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    print(f"Current working directory: {current_dir}")
    list_files(current_dir)
