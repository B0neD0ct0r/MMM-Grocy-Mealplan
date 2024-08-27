# MMM-Grocy  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ooohfascinating/MMM-Grocy/raw/master/LICENSE) <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"/>
MagicMirror² Module that displays the meal plan for the week from grocy on your magic mirror

![image](https://github.com/user-attachments/assets/b6bd66ed-61eb-443a-9b00-46d3b0b274e7)


## Dependencies

- instance of MagicMirror²

## Installation

1. Clone this repository into your `modules` folder and install node dependencies:

   ```bash
   cd ~/MagicMirror/modules
   git clone https://gitlab.com/ooohfascinating/MMM-Grocy
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
  }
},
```


