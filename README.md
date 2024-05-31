## Overview
This app is build using [Expo](https://docs.expo.dev/). Normally you would be able to preview the app using Expo Go, but because custom native code is required for in-app purchases, you must create a development build. 

## Testing
- To run locally, make sure to setup your simulator following these [instructions](https://docs.expo.dev/get-started/set-up-your-environment).
- You can run `npx expo prebuild` (This only needs to be run once)
  - This creates the android and ios directories for running your React code
- Open the project in XCode or Android Studio and build it in a simulator or your device
- Then run `npx expo start --dev-client`. Now you can run your development with live reloads
  - If you run into the error `No development build (com.ultrasoundguidanceorg.ultrasoundguidance) for this project is installed. Please make and install a development build on the device first.`, run `eas build:run -p ios` to install the build on a simulator then rerun the following command.

## Deploying
### Internally for sharing
- Make sure you're signed in and use `eas update` 
