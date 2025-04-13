import React, { FC, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  ActivityIndicator 
} from "react-native";
import axios from "axios";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

const BASE_URL = "http://localhost:8086"; // Replace with your machine's IP

type ConfirmOrderProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

const ExecuteTrade: FC<ConfirmOrderProps> = ({ navigation, route }) => {
  const { symbol, quantity, price, action, userId } = route.params || {};
  const totalPrice = Number(quantity) * Number(price);
  
  // Animation states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const spinAnim = useState(new Animated.Value(0))[0];

  // Action colors based on buy/sell
  const actionType = action?.toLowerCase() === "buy" ? "buy" : "sell";
  const actionColors = {
    buy: {
      main: '#a7f3d0',
      darker: '#047857',
      background: '#34d399',
      icon: 'trending-up' as const
    },
    sell: {
      main: '#fecaca',
      darker: '#b91c1c',
      background: '#f87171',
      icon: 'trending-down' as const
    }
  }[actionType];

  // Animation for card entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Animation for loading spinner
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const startLoadingAnimation = () => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ).start();
  };

  const handleComplete = async () => {
    setIsLoading(true);
    startLoadingAnimation();
    
    try {
      const endpoint = action === "Buy" ? "/buy" : "/sell";
      console.log(`Executing trade: ${BASE_URL}/api/investments${endpoint}`);
      console.log("Request body:", { userId, symbol, quantity: Number(quantity) });
      
      const response = await axios.post(`${BASE_URL}/api/investments${endpoint}`, {
        userId,
        symbol,
        quantity: Number(quantity),
      });
      
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      
      // Show success state
      setIsLoading(false);
      setIsSuccess(true);
      
      // Navigate after showing success animation
      setTimeout(() => {
        navigation.navigate("ManualTrade");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error executing trade:", error.message);
      setIsLoading(false);
      setIsError(true);
      
      if (error.response) {
        console.error("Response error status:", error.response.status);
        console.error("Response error data:", error.response.data);
        const message = typeof error.response.data === "string" ? 
          error.response.data : 
          JSON.stringify(error.response.data);
        setErrorMessage(message);
      } else {
        setErrorMessage("Error executing trade: " + error.message);
      }
    }
  };

  // Get stock icon based on symbol
  // Fix: Use `any` type or add specific icons to a more accurate union type
  const getStockIcon = (symbol: string): any => {
    const icons: {[key: string]: string} = {
      'AAPL': 'apple',
      'GOOG': 'google',
      'MSFT': 'microsoft',
      'AMZN': 'amazon',
      'FB': 'facebook',
      'TSLA': 'car-electric',
      'NFLX': 'television',
    };
    
    return icons[symbol] || 'chart-line';
  };

  // Error handling for missing parameters
  if (!symbol || !quantity || !price || !action || !userId) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: '#fef3c7' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fef3c7" />
        <Ionicons name="alert-circle-outline" size={60} color="#d97706" />
        <Text style={[styles.errorText, { color: '#92400e' }]}>Invalid order data. Please go back and try again.</Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: '#f59e0b' }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f3ff' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ff" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.title}>Execute Trade</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <Animated.View 
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Replace LinearGradient with custom card header */}
        <View style={[styles.cardHeader, { backgroundColor: actionColors.background }]}>
          <View style={styles.cardHeaderShade} />
          <View style={styles.cardHeaderContent}>
            <View style={styles.symbolContainer}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons 
                  name={getStockIcon(symbol)} 
                  size={26} 
                  color="#fff" 
                />
              </View>
              <Text style={styles.symbolText}>{symbol}</Text>
            </View>
            
            <View style={styles.actionBadge}>
              <MaterialCommunityIcons 
                name={actionColors.icon} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.actionText}>{action.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per Share</Text>
            <Text style={styles.priceValue}>${Number(price).toFixed(2)}</Text>
          </View>
          
          <View style={styles.quantityRow}>
            <View style={styles.quantityIconContainer}>
              <FontAwesome name="balance-scale" size={16} color={actionColors.darker} />
            </View>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityValueContainer}>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Text style={styles.quantityUnit}>shares</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <Text style={styles.totalValue}>{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              This trade will be executed immediately at the current market price.
            </Text>
          </View>
          
          <View style={styles.securityFeatures}>
            <View style={styles.securityItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#6b7280" />
              <Text style={styles.securityText}>Secure</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="flash-outline" size={16} color="#6b7280" />
              <Text style={styles.securityText}>Instant</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="lock-closed-outline" size={16} color="#6b7280" />
              <Text style={styles.securityText}>Protected</Text>
            </View>
          </View>
        </View>
      </Animated.View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="sync-outline" size={36} color={actionColors.darker} />
          </Animated.View>
          <Text style={[styles.loadingText, { color: actionColors.darker }]}>
            Executing your {action.toLowerCase()}...
          </Text>
        </View>
      ) : isSuccess ? (
        <View style={styles.successContainer}>
          <View style={[styles.statusIcon, { backgroundColor: '#d1fae5' }]}>
            <Ionicons name="checkmark-circle" size={60} color="#059669" />
          </View>
          <Text style={styles.successText}>Trade Executed Successfully!</Text>
          <Text style={styles.successSubtext}>
            Your {action.toLowerCase()} order for {quantity} shares of {symbol} has been completed.
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.errorResultContainer}>
          <View style={[styles.statusIcon, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="close-circle" size={60} color="#dc2626" />
          </View>
          <Text style={styles.errorResultText}>Trade Failed</Text>
          <Text style={styles.errorResultSubtext}>{errorMessage}</Text>
          <TouchableOpacity 
            style={[styles.tryAgainButton]} 
            onPress={() => {
              setIsError(false);
              setErrorMessage("");
            }}
          >
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.executeButton, { backgroundColor: actionColors.darker }]}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <FontAwesome name="check-circle" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Complete {action}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: 'center',
  },
  mainCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 30,
    overflow: 'hidden', // This ensures the gradient overlay stays within borders
  },
  cardHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    position: 'relative', // For positioning the overlay
  },
  cardHeaderShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // This creates a subtle gradient-like effect using a semi-transparent overlay
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 20,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative', // Above the shade
    zIndex: 1,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 4,
  },
  cardBody: {
    padding: 24,
  },
  priceRow: {
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityIconContainer: {
    marginRight: 8,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#6b7280',
    flex: 1,
  },
  quantityValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  quantityUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  totalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 2,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    marginLeft: 8,
  },
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  executeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  errorResultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorResultText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorResultSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tryAgainButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ExecuteTrade;