# MMM-Grocy  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ooohfascinating/MMM-Grocy/raw/master/LICENSE) <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"/>
MagicMirror² Module that displays the meal plan for the week from grocy on your magic mirror

![screenshot](https://github.com/ooohfascinating/MMM-Grocy/blob/main/docs/Screenshot.png)


THIS IS A VERY ROUGH FIRST DRAFT. I do apologize, as this is my first module, and i'm still learning the ropes

## Dependencies

- instance of MagicMirror²

## Installation

1. Clone this repository into your `modules` folder and install node dependencies:

   ```bash
   cd ~/MagicMirror/modules
   git clone https://github.com/ooohfascinating/MMM-Grocy
   cd MMM-Grocy
   npm install
   ```

2. Modify the config template below
3. Add configuration to your config.js

## Example Config

```js
{
  module: "MMM-Grocy",
  position: "top_left",
  config: {
    apiLocation:"https://grocy.example.com/api"
    textColor:"red"
  }
},
```
## Updating

To update the module to the latest version, use your terminal to go to your MMM-Grocy module folder and type the following command:

```bash
cd MMM-Grocy
git pull
npm install
```



