import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

/**
 * =========================
 * KONFIGURASI URL
 * =========================
 * DEV LOKAL:
 *   http://10.36.77.61:8000
 *
 * NGROK (REKOMENDASI):
 *   https://xxxx.ngrok-free.dev
 */
const WEBVIEW_URL = "https://semirespectable-herta-unloafing.ngrok-free.dev";

export default function RootLayout() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle tombol Back Android
  useEffect(() => {
    if (Platform.OS === "android") {
      const onBackPress = () => {
        if (webViewRef.current && canGoBack) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }
  }, [canGoBack]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style="dark" backgroundColor="#ffffff" />

        <View style={styles.container}>
          <WebView
            ref={webViewRef}
            source={{
              uri: WEBVIEW_URL, // WAJIB HTTPS (URL ngrok)
              headers: {
                // Menghilangkan halaman warning ngrok
                "ngrok-skip-browser-warning": "true",
              },
            }}
            style={styles.webview}

            /* === WAJIB UNTUK ANDROID WEBVIEW === */
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"          // ⬅️ KUNCI gambar tidak muncul
            originWhitelist={["*"]}
            allowsInlineMediaPlayback={true}

            /* === USER AGENT (NGROK + WEBVIEW ISSUE) === */
            userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36"

            /* === LOADING & NAVIGATION === */
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onNavigationStateChange={(navState) =>
              setCanGoBack(navState.canGoBack)
            }

            startInLoadingState
            renderLoading={() => <View />}

            /* === DEBUG ERROR === */
            onError={(e) => {
              console.log("WebView error:", e.nativeEvent);
            }}
          />
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
