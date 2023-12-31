import React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";

export default function Preloader() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color="#FFCB47" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
