import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import LessonCard from '../ui/LessonCard';

const {width} = Dimensions.get('window');

const UpcomingTasks = ({primaryCategories = []}) => {
  // عرض كل التصنيفات بدلاً من 3 فقط
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Task</Text>
      </View>

      {primaryCategories.map(category => (
        <LessonCard key={category.categoryId} category={category} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.875,
    alignSelf: 'center',
    gap: 16,
    marginTop: 26,
  },
  header: {},
  title: {
    fontSize: 20,
    lineHeight: 25,
    color: '#FFFFFF',
  },
});

export default UpcomingTasks;
