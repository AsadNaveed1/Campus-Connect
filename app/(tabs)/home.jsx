import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, IconButton } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "../../firebaseConfig";
import { useUserContext } from "../../contexts/UserContext";
import SearchButton from "../../components/SearchButton";
import MagicShake from "../../components/MagicShake";
import PostCard from "../../components/PostCard";

export default function Home() {
  const theme = useTheme();
  const { user } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [societyNames, setSocietyNames] = useState([]);

  const fetchPosts = async () => {
    if (user && user.joinedSocieties) {
      const postIds = [];
      const societyNamesPromises = user.joinedSocieties.map(async (societyId) => {
        const societyDoc = await getDoc(doc(firebaseDB, "societies", societyId));
        if (societyDoc.exists()) {
          const societyData = societyDoc.data();
          if (societyData.posts) {
            postIds.push(...societyData.posts);
          }
          return { id: societyId, name: societyData.name };
        }
        return { id: societyId, name: "Unknown Society" };
      });

      const societyNamesArray = await Promise.all(societyNamesPromises);
      setSocietyNames(societyNamesArray);

      const postsPromises = postIds.map(async (postId) => {
        const postDoc = await getDoc(doc(firebaseDB, "posts", postId));
        const postData = postDoc.data();
        const societyName = societyNamesArray.find(society => society.id === postData.society)?.name || "Unknown Society";
        return { id: postDoc.id, ...postData, societyName };
      });

      const postsArray = await Promise.all(postsPromises);
      postsArray.sort((a, b) => b.date.seconds - a.date.seconds);
      setPosts(postsArray);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Home
        </Text>
        <IconButton
          icon="reload"
          size={24}
          onPress={fetchPosts}
          style={{ marginRight: 0, marginTop: 8 }}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Recent Posts
        </Text>
        {posts.length > 0 ? (
          <>
            {posts.map(post => {
              const currentDate = new Date();
              const postDate = new Date(post.date.seconds * 1000);
              const isSameDate = currentDate.toDateString() === postDate.toDateString();

              const formattedDate = isSameDate
                ? postDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
                : postDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

              return (
                <PostCard
                  key={post.id}
                  postId={post.id}
                  image={post.image}
                  caption={post.caption}
                  date={formattedDate}
                  societyName={post.societyName}
                />
              );
            })}
            <View style={styles.bottomSpacer}></View>
          </>
        ) : (
          <View style={styles.centeredContainer}>
            <Text style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
              Join some societies to see their posts here.
            </Text>
          </View>
        )}
      </ScrollView>

      <SearchButton />
      <MagicShake />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontWeight: "bold",
  },
  container: {
    padding: 24,
    marginBottom: 80,
  },
  bottomSpacer: {
    padding: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});