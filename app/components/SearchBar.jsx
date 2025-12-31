import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Search from '../assets/svgs/Search'; // أيقونة البحث (SVG)
import Filter from '../assets/svgs/Filter'; // أيقونة الفلتر (SVG)

const {width} = Dimensions.get('window');

const SearchBar = () => {
  return (
    <View style={styles.container}>
      {/* زر الفلتر على اليمين */}

      {/* الـ View الداخلي للحقل النصي مع أيقونة البحث */}
      <View style={styles.inputContainer}>
        <Search style={styles.searchIcon} />
        <TextInput
          placeholder="Search course, topic, mentor..."
          placeholderTextColor="#888" // يمكنك تغييره حسب التصميم
          style={styles.textInput}
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Filter /> {/* حجم الأيقونة حسب الحاجة */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.875, // 87.5% من عرض الشاشة
    height: 46,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 12,
    width: 18,
    height: 18,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.33,
    lineHeight: 14,
    padding: 0,
    margin: 0,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
});

export default SearchBar;
