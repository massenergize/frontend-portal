"""
This script makes sure we have the right
"""
import sys, os
from termcolor import colored
import json

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))
CONFIG_PATH = os.path.join(__location__, '../src/config/config.json') 
BUILD_VERSION_PATH = os.path.join(__location__, 'build.json') 


def get_target_config(target, is_local):
  if target == 'dev':
    return {
      "IS_LOCAL": is_local,
      "IS_PROD": False,
      "IS_SANDBOX": False,
      "BUILD_VERSION": generate_new_build_number(target)
    }


  elif target == 'dev-sandbox':
    return {
      "IS_LOCAL": is_local,
      "IS_PROD": False,
      "IS_SANDBOX": True,
      "BUILD_VERSION": generate_new_build_number(target)
    }

  elif target == 'prod':
    return {
      "IS_LOCAL": is_local,
      "IS_PROD": True,
      "IS_SANDBOX": False,
      "BUILD_VERSION": generate_new_build_number(target)
    }

  elif target == 'prod-sandbox':
    return {
      "IS_LOCAL": is_local,
      "IS_PROD": True,
      "IS_SANDBOX": True,
      "BUILD_VERSION": generate_new_build_number(target)
    }

  else:
    #assume dev
    return {
      "IS_LOCAL": is_local,
      "IS_PROD": False,
      "IS_SANDBOX": False,
      "BUILD_VERSION": generate_new_build_number(target)
    }

def generate_new_build_number(target) -> str:
  old_build_versions = load_json_contents(BUILD_VERSION_PATH)
  build_version_for_target = old_build_versions.get(target)
  parts = [int(k) for k in build_version_for_target.split('.')]
  part1 = parts[0] if len(parts) > 0 else 0
  part2 = parts[1] if len(parts) > 1 else 0
  part3 = parts[2] if len(parts) > 2 else 0

  part3 += 1
  if part3 >=100:
    part2 += 1
    part3 = 0
    if part2 >= 100:
      part1 +=1
      part2 = 0
  
  return f'{part1}.{part2}.{part3}'


def load_json_contents(path) -> dict:
  data = {}
  with open(path) as f:
    data = json.load(f)
  
  print(data)
  return data


def write_json_contents(path, data) -> bool:
  with open(path, 'w') as f:
    print(path, data)
    json.dump(data, f, indent=2)
  return True


def generate_config(target, is_local, is_deploy):
  # old_config = load_json_contents(CONFIG_PATH)
  new_config = get_target_config(target, is_local)
  success = write_json_contents(CONFIG_PATH, new_config)

  if is_deploy:
    build_versions = load_json_contents(BUILD_VERSION_PATH)
    build_versions[target] = new_config.get('BUILD_VERSION')
    write_json_contents(BUILD_VERSION_PATH, build_versions )

  if success:
    return (f'Running ON {"PROD" if new_config.get("IS_PROD") else "DEV" }, \
      Sandbox={new_config.get("IS_SANDBOX")}, \
        Local={new_config.get("IS_LOCAL") }', True)
  return ('Updating Config Failed!', False)


def run() -> (str, bool):
  args = sys.argv
  if len(args) > 1:
    target = args[1]
  else:
    target = 'dev'
  
  if len(args) > 2:
    is_local = args[2] in ['1', 'true', 'True']
  else:
    is_local = False

  if len(args) > 3:
    is_deploy = args[3] in ['1', 'true', 'True']
  else:
    is_deploy = False

  return generate_config(target, is_local, is_deploy)


if __name__ == '__main__':
  msg, success = run()
  if success:
    print(colored(msg, 'green'))
  else:
    print(colored(msg, 'red'))