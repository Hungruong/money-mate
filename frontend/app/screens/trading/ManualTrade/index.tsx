import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Animated,
  Easing
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const ManualTrade = ({ navigation }: any) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState("Buy");
  const [userId] = useState("27431f9a-3b99-426f-909e-5301102b115d"); // Mock UUID, replace with auth

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const floatingIconY1 = useRef(new Animated.Value(0)).current;
  const floatingIconY2 = useRef(new Animated.Value(0)).current;
  const floatingIconY3 = useRef(new Animated.Value(0)).current;

  // Start initial animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Start floating animations for decorative icons
    startFloatingAnimations();
  }, []);

  // Animation for action button change
  useEffect(() => {
    // Spin the icon when changing action
    Animated.timing(iconRotateAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => {
      iconRotateAnim.setValue(0);
    });
  }, [action]);

  // Start the continuous floating animations for decorative icons
  const startFloatingAnimations = () => {
    const createFloatingAnimation = (animValue: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1500, 
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      ).start();
    };
    
    createFloatingAnimation(floatingIconY1);
    
    // Delay the start of other animations for a staggered effect
    setTimeout(() => createFloatingAnimation(floatingIconY2), 400);
    setTimeout(() => createFloatingAnimation(floatingIconY3), 800);
  };

  // Button press animation
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Rotate interpolation for the icon
  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleQuantityChange = (value: string) => {
    if (value === "" || (Number(value) >= 1 && !isNaN(Number(value)))) {
      setQuantity(value);
    }
  };

  const handleSubmit = () => {
    if (!symbol || !quantity) {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all required fields before proceeding.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    animateButtonPress();
    navigation.navigate("ConfirmOrder", { symbol, quantity, action, userId });
  };

  // Animation for action change
  const handleActionChange = (newAction: string) => {
    if (newAction === action) return;
    
    // Animate opacity change for smooth transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setAction(newAction);
  };

  // Get background colors based on action
  const getBackgroundColors = () => {
    return action === "Buy" 
      ? { startColor: '#ffdfe6', endColor: '#ffc5d3' } 
      : { startColor: '#add8e6', endColor: '#87cefa' };
  };

  const { startColor, endColor } = getBackgroundColors();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar barStyle="light-content" />
      <View 
        style={[
          styles.gradientContainer,
          { backgroundColor: startColor }
        ]}
      >
        {/* Custom gradient replacement using multiple views */}
        <View style={styles.gradientOverlay}>
          <Animated.View 
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: endColor,
                opacity: 0.8,
              }
            ]}
          />
        </View>
        
        <View style={styles.container}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Manual Trade</Text>
            <TouchableOpacity style={styles.helpButton}>
              <MaterialIcons name="help-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeIcons}>
            {action === "Buy" ? (
              <>
                <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatingIconY1 }] }]}>
                  <MaterialCommunityIcons name="chart-line" size={24} color="rgba(255,255,255,0.7)" />
                </Animated.View>
                <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatingIconY2 }] }]}>
                  <FontAwesome5 name="money-bill-wave" size={18} color="rgba(255,255,255,0.6)" />
                </Animated.View>
                <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatingIconY3 }] }]}>
                  <Ionicons name="trending-up" size={22} color="rgba(255,255,255,0.8)" />
                </Animated.View>
              </>
            ) : (
              <>
                <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatingIconY1 }] }]}>
                  <MaterialCommunityIcons name="cash-multiple" size={24} color="rgba(255,255,255,0.7)" />
                </Animated.View>
                <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatingIconY2 }] }]}>
                  <FontAwesome5 name="chart-area" size={18} color="rgba(255,255,255,0.6)" />
                </Animated.View>
                <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatingIconY3 }] }]}>
                  <Ionicons name="wallet-outline" size={22} color="rgba(255,255,255,0.8)" />
                </Animated.View>
              </>
            )}
          </View>
          
          {/* Main Card */}
          <Animated.View 
            style={[
              styles.card,
              { 
                opacity: fadeAnim, 
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ] 
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Animated.View 
                style={[
                  styles.cardHeaderIconContainer,
                  { transform: [{ rotate: iconRotation }] }
                ]}
              >
                <FontAwesome5 
                  name={action === "Buy" ? "shopping-cart" : "hand-holding-usd"} 
                  size={28} 
                  color={action === "Buy" ? "#ffb6c1" : "#87cefa"} 
                  style={styles.cardHeaderIcon} 
                />
              </Animated.View>
              <View>
                <Text style={styles.cardTitle}>
                  {action === "Buy" ? "Buy Stocks" : "Sell Stocks"}
                </Text>
                <Text style={styles.cardSubtitle}>Enter your trade details below</Text>
              </View>
            </View>
            
            {/* Symbol Input */}
            <Animated.View 
              style={[
                styles.inputContainer,
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <MaterialIcons name="search" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Stock Symbol (e.g., AAPL)"
                value={symbol}
                onChangeText={setSymbol}
                autoCapitalize="characters"
                placeholderTextColor="#999"
              />
              {symbol ? (
                <TouchableOpacity onPress={() => setSymbol("")} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              ) : null}
            </Animated.View>
            
            {/* Quantity Input */}
            <Animated.View 
              style={[
                styles.inputContainer,
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <FontAwesome5 name="sort-numeric-up" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Quantity (min: 1)"
                keyboardType="numeric"
                value={quantity}
                onChangeText={handleQuantityChange}
                placeholderTextColor="#999"
              />
              {quantity ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    onPress={() => handleQuantityChange((Number(quantity) - 1).toString())}
                    disabled={Number(quantity) <= 1}
                    style={[styles.quantityButton, Number(quantity) <= 1 ? styles.disabledQuantityButton : null]}
                  >
                    <Feather name="minus" size={16} color={Number(quantity) <= 1 ? "#ccc" : "#666"} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleQuantityChange((Number(quantity) + 1).toString())}
                    style={styles.quantityButton}
                  >
                    <Feather name="plus" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </Animated.View>
            
            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.actionContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.buyButton,
                  action === "Buy" && styles.activeButton,
                ]}
                onPress={() => handleActionChange("Buy")}
              >
                <FontAwesome5 name="shopping-cart" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.sellButton,
                  action === "Sell" && styles.activeButton,
                ]}
                onPress={() => handleActionChange("Sell")}
              >
                <FontAwesome5 name="hand-holding-usd" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Info Box */}
            <Animated.View 
              style={[
                styles.infoBox,
                { opacity: fadeAnim }
              ]}
            >
              <Ionicons name="information-circle-outline" size={20} color="#6a5acd" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                {action === "Buy" 
                  ? "Buy shares at current market price. Review your order before confirmation." 
                  : "Sell shares at current market price. Review your order before confirmation."}
              </Text>
            </Animated.View>
            
            {/* Submit Button */}
            <Animated.View
              style={{ transform: [{ scale: buttonScaleAnim }] }}
            >
              <TouchableOpacity
                style={[styles.submitButton, !symbol || !quantity ? styles.disabledButton : null]}
                onPress={handleSubmit}
                disabled={!symbol || !quantity}
              >
                <Text style={styles.submitButtonText}>Next: Confirm Order</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    padding: 8,
  },
  helpButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  decorativeIcons: {
    position: "absolute",
    top: 90,
    width: "100%",
    height: 100,
  },
  floatingIcon1: {
    position: "absolute",
    left: "10%",
    top: 10,
  },
  floatingIcon2: {
    position: "absolute",
    right: "15%",
    top: 25,
  },
  floatingIcon3: {
    position: "absolute",
    left: "30%",
    top: 50,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  cardHeaderIconContainer: {
    marginRight: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 12,
    borderRadius: 12,
  },
  cardHeaderIcon: {
    // Icon styles
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    paddingRight: 16,
  },
  quantityControls: {
    flexDirection: "row",
    paddingRight: 10,
  },
  quantityButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  disabledQuantityButton: {
    backgroundColor: "#f8f8f8",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 12,
    width: "48%",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buyButton: {
    backgroundColor: "#ffb6c1",
    opacity: 0.7,
  },
  sellButton: {
    backgroundColor: "#87cefa",
    opacity: 0.7,
  },
  activeButton: {
    opacity: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(106, 90, 205, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a5acd",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#b0b0b0",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
});

export default ManualTrade;