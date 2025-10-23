import { spawn } from 'node:child_process';

class Init {

  static parser = process.env.npm_config_parser;
  static videoFormat = process.env.npm_config_videoformat;
  static platform = process.env.npm_config_platform;
  static suite = process.env.npm_config_suite;
  static divid = process.env.npm_config_divid;
  static isRealtime = Function('return ' + process.env.npm_config_isrealtime)() || false;

  static getArgs() {
    return Init.isRealtime ? [Init.parser, Init.platform, Init.suite] : [Init.parser, Init.videoFormat, Init.platform, Init.suite, Init.divid];
  }

  static execute() {

    const testCmd = Init.getArgs().toString().replaceAll(',', ' ');

    console.log(`> Args: docker exec -i cms_environment_wdio npm run --silent ${testCmd}`);

    const child = spawn('docker', ['exec', '-i', 'cms_environment_wdio', 'npm', 'run', '--silent'].concat(Init.getArgs()),
      {
        stdio: 'inherit',
        shell: true,
      }
    );

    child.on('data', data => {
      console.error(`stderr: ${data}`);
    });

    child.on('error', (error) => {
      console.error(`error: ${error.message}`);
    });

    child.on('close', (code) => {
      console.log(`Child Process Exited With Code ${code}`);
      process.exit(code);
    });
    
  }
}


Init.execute()

// run test suite -> npm run init --parser={parser} --videoFormat={videoFormat} --platform={platform} --suite={suite}
// run testEvents suite -> npm run init --parser={parser} --platform={platform} --suite={suite} --isRealtime={bool}