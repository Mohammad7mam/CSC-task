// screens/AdminEnrollments.js
import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProfileImage from '../ui/profileImage';
import {
  checkAdminStatus,
  fetchEnrollments,
  updateEnrollmentStatus,
  setRefreshing,
  clearError,
} from '../redux/adminEnrollmentsSlice';
import {
  selectFilteredEnrollments,
  selectIsAdmin,
  selectLoading,
  selectRefreshing,
  selectActionLoading,
  selectCurrentUser,
  selectError,
  selectFormattedStatistics,
} from '../redux/adminEnrollmentsSelectors';

const {width, height} = Dimensions.get('window');

const AdminEnrollments = ({navigation}) => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const enrollments = useSelector(selectFilteredEnrollments);
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectLoading);
  const refreshing = useSelector(selectRefreshing);
  const actionLoading = useSelector(selectActionLoading);
  const currentUser = useSelector(selectCurrentUser);
  const error = useSelector(selectError);
  const statistics = useSelector(selectFormattedStatistics);

  // Memoized callbacks for better performance
  const handleRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchEnrollments());
  }, [dispatch]);

  const handleUpdateStatus = useCallback(
    (enrollmentId, newStatus) => {
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) return;

      const statusText = newStatus === 'approved' ? 'approve' : 'reject';
      const statusDisplay = newStatus === 'approved' ? 'Approved' : 'Rejected';

      Alert.alert(
        'Change Status',
        `Are you sure you want to ${statusText} this request?${
          newStatus === 'approved'
            ? '\n\nA progress record will be automatically created for the user.'
            : ''
        }`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: actionLoading ? 'Processing...' : 'Confirm',
            onPress: () => {
              dispatch(
                updateEnrollmentStatus({
                  enrollmentId,
                  newStatus,
                  enrollment,
                }),
              );
            },
          },
        ],
      );
    },
    [enrollments, actionLoading, dispatch],
  );

  const formatDate = useCallback(dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getStatusColor = useCallback(status => {
    switch (status) {
      case 'pending':
        return '#FFA726';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }, []);

  const getStatusText = useCallback(status => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {text: 'OK', onPress: () => dispatch(clearError())},
      ]);
    }
  }, [error, dispatch]);

  // Initial load
  useEffect(() => {
    dispatch(checkAdminStatus());
    dispatch(fetchEnrollments());
  }, [dispatch]);

  // Handle unauthorized access
  useEffect(() => {
    if (currentUser && !isAdmin) {
      Alert.alert('Unauthorized', 'This page is for administrators only', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [currentUser, isAdmin, navigation]);

  // Render each enrollment item
  const renderEnrollmentItem = useCallback(
    ({item}) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.courseTitle}>{item.courseTitle}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>User:</Text>
            <Text style={styles.value}>{item.userName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{item.userEmail}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Instructor:</Text>
            <Text style={styles.value}>{item.instructorName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>
              ${item.price?.amount || 0} {item.price?.currency || 'USD'}
              {item.price?.discountPercentage > 0 &&
                ` (${item.price.discountPercentage}% off)`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(item.requestDate)}</Text>
          </View>

          {item.message && (
            <View style={styles.messageContainer}>
              <Text style={styles.label}>Message:</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}

          {item.progressId && (
            <View style={styles.progressInfo}>
              <Text style={styles.label}>Progress ID:</Text>
              <Text style={styles.progressIdText}>{item.progressId}</Text>
            </View>
          )}
        </View>

        {item.status === 'pending' && isAdmin && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.approveButton,
                actionLoading && styles.buttonDisabled,
              ]}
              onPress={() => handleUpdateStatus(item.id, 'approved')}
              disabled={actionLoading}>
              {actionLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Approve</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.rejectButton,
                actionLoading && styles.buttonDisabled,
              ]}
              onPress={() => handleUpdateStatus(item.id, 'rejected')}
              disabled={actionLoading}>
              {actionLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [
      actionLoading,
      isAdmin,
      handleUpdateStatus,
      getStatusColor,
      getStatusText,
      formatDate,
    ],
  );

  // Loading states
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C6AF1" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (loading && enrollments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C6AF1" />
        <Text style={styles.loadingText}>Loading enrollment requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161616" barStyle="light-content" />
      {/* <ProfileImage/> */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enrollment Management</Text>
        <Text style={styles.headerSubtitle}>
          Total: {statistics.total} requests
          {statistics.pending > 0 && ` (${statistics.pending} pending)`}
        </Text>
      </View>

      <FlatList
        data={enrollments}
        renderItem={renderEnrollmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#7C6AF1']}
            tintColor="#7C6AF1"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No enrollment requests currently
            </Text>
          </View>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => {
            Alert.alert(
              'Statistics',
              `📊 Enrollment Statistics\n\n` +
                `• Total Requests: ${statistics.total}\n` +
                `• Pending: ${statistics.pending}\n` +
                `• Approved: ${statistics.approved}\n` +
                `• Rejected: ${statistics.rejected}\n\n` +
                `📈 Percentages:\n` +
                `• Pending: ${statistics.pendingPercentage}%\n` +
                `• Approved: ${statistics.approvedPercentage}%\n` +
                `• Rejected: ${statistics.rejectedPercentage}%`,
              [{text: 'OK'}],
            );
          }}>
          <Text style={styles.statsButtonText}>View Statistics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#7C6AF1',
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  courseTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
  },
  messageContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
  },
  progressInfo: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#2D2D2D',
    borderRadius: 6,
  },
  progressIdText: {
    color: '#7C6AF1',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  statsButton: {
    backgroundColor: '#7C6AF1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  statsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminEnrollments;
