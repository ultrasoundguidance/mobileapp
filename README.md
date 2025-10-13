## Overview
This app is build using [Expo](https://docs.expo.dev/). Normally you would be able to preview the app using Expo Go, but because custom native code is required for in-app purchases, you must create a development build using EAS. Good [video lessons](https://egghead.io/courses/build-and-deploy-react-native-apps-with-expo-eas-85ab521e) covering all EAS builds.

## Testing
- To run on a simulator, make sure to following these [instructions](https://docs.expo.dev/get-started/set-up-your-environment).
- You can run `npx expo prebuild` (This only needs to be run once)
  - This creates the android and ios directories for running your React code
- To build for a physical device and your running iOS 16 and above, you'll first need to enable Developer Mode by following these [instructions](https://docs.expo.dev/guides/ios-developer-mode/). Then run `eas build --profile=development --platform=ios` to create a build. Then download it by scanning the QR code after the build finishes. The QR code can also be scanned from the expo.dev website.
- Then run `npx expo start --dev-client`. Now you can run your development with live reloads
  - If you run into the error `No development build (com.ultrasoundguidanceorg.ultrasoundguidance) for this project is installed. Please make and install a development build on the device first.`, run `eas build:run -p ios` to install the build on a simulator then rerun the following command.

## Deploying
### Internally for sharing
- Make sure you're signed in and use `eas update` 

### Production
- First bump up the version number in app.json
- Then, run `eas build` -> `eas submit`


### Debugging Production Builds
If you notice production builds don't have your latest changes, check these things:
1. Ensure all the changes you want built have been committed.
2. [Verify that your project builds and runs locally](https://docs.expo.dev/build-reference/troubleshooting/) (`process.env.NODE_ENV = production`)
   ```
  # Locally compile and run the Android app in release mode
  npx expo run:android --variant release

  # Locally compile and run the ios app in release mode
  npx expo run:ios --configuration Release
```
3. When testing an internal build, open link in web browser and select emulator to install app on