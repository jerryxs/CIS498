#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/JacobMeloche/Desktop/CIS498-master 2/TEST/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/JacobMeloche/Desktop/CIS498-master 2/TEST/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:/opt/X11/bin:~/.dotnet/tools:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Users/JacobMeloche/Library/Android/sdk/tools:/Users/JacobMeloche/Library/Android/sdk/tools/bin/:/Users/JacobMeloche/Library/Android/sdk/platform-tools:/Users/JacobMeloche/Library/Android/sdk/tools:/Users/JacobMeloche/Library/Android/sdk/tools/bin
      npm $@
    