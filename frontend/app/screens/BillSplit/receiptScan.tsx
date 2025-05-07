import React, { useState, useRef } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { API_ENDPOINTS, API_CONFIG, handleApiError } from "../../config/api";
import ImageConfirmation from "../../components/ImageConfirmation";
import ScanResult from "../../components/ScanResult";

export default function ReceiptScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const resetScan = () => {
    setCapturedImage(null);
    setScanResult(null);
    setScanError(null);
    setIsProcessing(false);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (!photo) {
        throw new Error("Failed to capture photo");
      }

      setCapturedImage(photo.uri);
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Failed to take picture: " + (error?.message || "Unknown error")
      );
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);
      setIsProcessing(true);
      setScanError(null);

      // Get the file name from the URI
      const fileName = uri.split("/").pop() || "receipt.jpg";

      // Create form data
      const formData = new FormData();

      // Create file object for React Native
      const file = {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: "image/jpeg",
        name: fileName,
      };

      // Append the file to form data with the correct field name
      formData.append("image", file as any);

      console.log("Uploading image:", uri);
      console.log("File object:", file);

      // Upload to your API
      const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      // Log the response status and headers for debugging
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Failed to process receipt");
      }

      const data = JSON.parse(responseText);
      setScanResult(data);
      setCapturedImage(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      setScanError(handleApiError(error));
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    resetScan();
  };

  const handleSplitBill = () => {
    // Navigate to bill splitting screen with scan result
    Alert.alert("Success", "Proceeding to split bill...");
    // Add navigation logic here
  };

  // Show scan results if available
  if (scanResult || scanError || isProcessing) {
    return (
      <ScanResult
        isLoading={isProcessing}
        data={scanResult}
        error={scanError || undefined}
        onRetry={handleRetake}
        onConfirm={handleSplitBill}
      />
    );
  }

  // Show image confirmation if image is captured
  if (capturedImage) {
    return (
      <ImageConfirmation
        imageUri={capturedImage}
        onConfirm={() => uploadImage(capturedImage)}
        onRetake={handleRetake}
        isProcessing={isUploading}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        ratio="16:9"
        facing={facing}
      >
        <View style={styles.overlay}>
          <Text style={styles.instructions}>
            Align the receipt within the frame
          </Text>
        </View>
      </CameraView>
      {permission.granted && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.toggleText}>
              {facing === "back"
                ? "Switch to Front Camera"
                : "Switch to Back Camera"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  instructions: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
  },
  captureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  toggleButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 50,
  },
  toggleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
