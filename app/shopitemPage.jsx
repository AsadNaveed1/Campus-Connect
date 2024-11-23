import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ShopCard from "../components/ShopCard"; // Import ShopCard component
import { useRouter } from "expo-router";
const { width: screenWidth } = Dimensions.get("window");

export default function ShopItemPage() {
  // Sample data for items sold by the same society
  const router = useRouter();
  const otherItems = [
    {
      id: "1",
      title: "Stylish Winter Jacket",
      price: "299.99",
      society: "Fashion Club",
      location: "Chow Ye Ching Building, HKU",
      availability: "Available",
      description:
        "This jacket is perfect for winter. It combines warmth and style for a chic look.",
      image: require("../assets/images/hoodie.jpg"),
    },
    {
      id: "2",
      title: "Classic Leather Shoes",
      price: "159.99",
      society: "Fashion Club",
      location: "Chow Ye Ching Building, HKU",
      availability: "Available",
      description:
        "Elegant and durable leather shoes for both formal and casual occasions.",
      image: require("../assets/images/hoodie.jpg"),
    },
    {
      id: "3",
      title: "Elegant Handbag",
      price: "89.99",
      society: "Fashion Club",
      location: "Chow Ye Ching Building, HKU",
      availability: "Available",
      description:
        "A stylish handbag crafted with premium materials for a modern fashion statement.",
      image: require("../assets/images/hoodie.jpg"),
    },
    {
      id: "4",
      title: "Casual T-Shirt",
      price: "29.99",
      society: "Fashion Club",
      location: "Chow Ye Ching Building, HKU",
      availability: "Available",
      description:
        "A comfortable t-shirt made from high-quality fabric. Perfect for daily wear.",
      image: require("../assets/images/hoodie.jpg"),
    },
  ];

  // State to hold the currently selected item's data
  const [selectedItem, setSelectedItem] = useState({
    title: "Fashion Blue Hoodie",
    price: "569.99",
    society: "Fashion Club",
    location: "Chow Ye Ching Building, HKU",
    availability: "Available",
    description:
      "This hoodie is designed for ultimate comfort and style. Made from premium materials, it features a relaxed fit, soft fabric, and a cozy hood, making it perfect for casual outings or lounging at home.",
    imageUri: require("../assets/images/hoodie.jpg"),
  });

  const handleBackPress = () => {
    console.log("Back button pressed!");
    // Add navigation logic if necessary
    router.push("/societyPage");
  };

  const handleItemPress = (item) => {
    // Update the selected item in the state
    setSelectedItem({
      title: item.title,
      price: item.price,
      society: item.society,
      location: item.location,
      availability: item.availability,
      description: item.description,
      imageUri: item.image,
    });
  };

  return (
    <View style={styles.container}>
      {/* Full-Width Image with Back Button */}
      <View style={styles.imageContainer}>
        <Image source={selectedItem.imageUri} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <ScrollView>
          {/* Price */}
          <Text style={styles.price}>${selectedItem.price}</Text>

          {/* Title */}
          <Text style={styles.title}>{selectedItem.title}</Text>

          {/* Society */}
          <Text style={styles.society}>Sold by: {selectedItem.society}</Text>

          {/* Location */}
          <Text style={styles.location}>Location: {selectedItem.location}</Text>

          {/* Availability */}
          <View
            style={[
              styles.availabilityContainer,
              {
                backgroundColor:
                  selectedItem.availability === "Available"
                    ? "#2a9d8f"
                    : "#e63946",
              },
            ]}
          >
            <Text style={styles.availabilityText}>
              {selectedItem.availability}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{selectedItem.description}</Text>

          {/* Other Items Section */}
          <Text style={styles.otherItemsHeader}>
            Other Items from {selectedItem.society}
          </Text>

          {/* Render Other Items */}
          <FlatList
            data={otherItems}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.otherItemsList}
            renderItem={({ item }) => (
                <Pressable onPress={() => handleItemPress(item)}>
                <ShopCard
                  image={item.image}
                  title={item.title}
                  price={item.price}
                />
             </Pressable>

            )}

          />
          
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 350,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  heartButton: {
    position: "absolute",
    top: 40,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 20,
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  society: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  availabilityContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  otherItemsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  otherItemsList: {
    paddingHorizontal: 10,
  },
});