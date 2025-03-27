// Import required polyfills first
// import 'fast-text-encoding';

import 'text-encoding';
import 'react-native-get-random-values';
import "react-native-gesture-handler";
import * as crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';
import 'expo-router/entry';

// Global assignments after imports
global.crypto = crypto;
global.Buffer = Buffer;
