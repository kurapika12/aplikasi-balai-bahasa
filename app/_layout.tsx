import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  BackHandler, 
  Platform 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// --- KONFIGURASI URL ---
// Ganti dengan URL ngrok atau URL publik backend kamu
const WEBVIEW_URL = 'http://10.10.152.93:8000'; 

export default function RootLayout() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle tombol Back di Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (webViewRef.current && canGoBack) {
          webViewRef.current.goBack();
          return true; // mencegah aplikasi keluar
        }
        return false; // biarkan aplikasi keluar jika tidak ada history
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }
  }, [canGoBack]);

  return (
    <SafeAreaProvider>
      {/* SafeAreaView menjaga area status bar */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* StatusBar dengan ikon gelap dan background putih */}
        <StatusBar style="dark" backgroundColor="#ffffff" />

        <View style={styles.container}>
          <WebView
            ref={webViewRef}
            source={{ uri: WEBVIEW_URL }}
            style={styles.webview}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            domStorageEnabled
            javaScriptEnabled
            startInLoadingState
            renderLoading={() => <View />} // kosong, karena kita handle loading sendiri
          />

          {/* Custom Loading Spinner */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // background di belakang status bar
  },
  container: {
    flex: 1,
    position: 'relative', 
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff', // memastikan spinner muncul di atas WebView
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
