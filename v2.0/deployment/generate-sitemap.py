import requests, os, sys
from deployment.prepare_to_deploy import CONFIG_PATH, load_json_contents

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

def write_text_contents(path, contents) -> str:
    if not os.path.exists(os.path.dirname(path)):
        try:
            os.makedirs(os.path.dirname(path))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    with open(path, "w") as f:
        data = f.write(contents)
    return True


def main():
  try:
    #config = load_json_contents(CONFIG_PATH)
    config = { 'IS_LOCAL': True }
    api_host = 'https://api-dev.massenergize.org'
    if config['IS_LOCAL']:
      api_host = 'http://localhost:8000'
    elif config['IS_PROD']:
      api_host = 'https://api.massenergize.org'
    else:
      api_host = 'https://api-dev.massenergize.org'

    res = requests.post(f"{api_host}/sitemap", data = {}).text
    write_text_contents(f"{BASE_DIR}/public/sitemap.xml", res)

  except Exception as e:
    print("Error occurred: ", e)

if __name__ == '__main__':
  main()