import React from "react";
import {Alert, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {Camera, CameraType, FaceDetectionResult} from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import {FaceFeature} from "expo-face-detector";

import {StatusBar} from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {useFonts} from "expo-font";

import {Ionicons} from "@expo/vector-icons";
import Preloader from "./components/Preloader";

SplashScreen.preventAutoHideAsync()
	.then(_ => console.debug("SplashScreen prevented auto hide!"))
	.catch(console.warn);

export default function App() {
	const [hasPermission, setHasPermission] = React.useState(false);
	const [type, setType] = React.useState(CameraType.back);

	const [faces, setFaces] = React.useState([] as FaceFeature[]);
	const cameraRef = React.useRef<Camera>(null);

	const [fontsLoaded] = useFonts({"SF-Pro": require("./assets/fonts/SF-Pro.otf")});

	React.useEffect(() => {
		async function getPermission() {
			const {status} = await Camera.requestCameraPermissionsAsync();
			if (status === "granted") setHasPermission(true);
			else Alert.alert("Camera permission denied!",
				"Please enable camera permission for detecting faces.", [{
					text: "Open Settings",
					onPress: () => Linking.openSettings(),
				}]);
		}

		getPermission()
			.then(_ => console.debug("Camera permission granted!"))
			.catch(err => console.error("Camera permission denied!", err));
	}, []);

	const onLayoutRootView = React.useCallback(async () => fontsLoaded && await SplashScreen.hideAsync(), [fontsLoaded]);

	if (hasPermission === null || !fontsLoaded) return <Preloader />;
	if (!hasPermission) return <Text style={styles.errorMessage}>No access to camera</Text>;

	return (
		<SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
			<Camera
				style={styles.camera}
				type={type}
				ref={cameraRef}
				onCameraReady={() => setFaces([])}
				ratio="16:9"
				onFacesDetected={({faces}: FaceDetectionResult) => faces.length > 0 && setFaces(faces as FaceFeature[])}
				faceDetectorSettings={{
					mode: FaceDetector.FaceDetectorMode.fast,
					detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
					runClassifications: FaceDetector.FaceDetectorClassifications.all,
					minDetectionInterval: 100,
					tracking: true,
				}}>
				{faces.length > 0 && faces.map(face => (
					<View
						key={face.faceID}
						style={{
							position: "absolute",
							borderWidth: 2,
							borderColor: "#FFCB47",
							width: face.bounds.size.width,
							height: face.bounds.size.height,
							transform: [
								{translateX: face.bounds.origin.x},
								{translateY: face.bounds.origin.y},
								{rotateZ: `${face.rollAngle}deg`},
								{rotateY: `${face.yawAngle}deg`},
							],
						}}
					/>
				))}
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						setType(type === CameraType.back ? CameraType.front : CameraType.back);
						setFaces([]);
					}}>
					<Ionicons name="camera-reverse" size={24} color="#FFCB47" />
				</TouchableOpacity>
			</Camera>
			<Text style={styles.footer}>Faces detected: {faces.length}</Text>
			<StatusBar hidden />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#202020",
		alignItems: "center",
		justifyContent: "center",
	},
	errorMessage: {
		fontSize: 16,
		color: "#FFCB47",
		textAlign: "center",
		fontFamily: "SF-Pro",
		flex: 1,
		justifyContent: "center",
	},
	button: {
		position: "absolute",
		bottom: 16,
		right: 16,
	},
	footer: {
		fontSize: 16,
		color: "#FFCB47",
		marginBottom: 16,
		fontFamily: "SF-Pro",
		position: "absolute",
		bottom: 0,
	},
	camera: {
		flex: 1,
		width: "100%",
	},
});
