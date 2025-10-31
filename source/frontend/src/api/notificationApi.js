/**
 * API functions for notifications
 */
import { apiRequest } from './api';

/**
 * Gets all notifications for the current user
 * @returns {Promise<Array>} Array of notification objects
 */
export const getNotifications = () => {
    return apiRequest('/notifications');
};

/**
 * Gets only unread notifications for the current user
 * @returns {Promise<Array>} Array of unread notification objects
 */
export const getUnreadNotifications = () => {
    return apiRequest('/notifications/unread');
};

/**
 * Gets the count of unread notifications
 * @returns {Promise<{count: number}>} Object with unread count
 */
export const getUnreadCount = () => {
    return apiRequest('/notifications/unread/count');
};

/**
 * Marks a specific notification as read
 * @param {number} notificationId - The ID of the notification to mark as read
 * @returns {Promise<any>}
 */
export const markAsRead = (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
        method: 'PUT'
    });
};

/**
 * Marks all notifications as read for the current user
 * @returns {Promise<any>}
 */
export const markAllAsRead = () => {
    return apiRequest('/notifications/read-all', {
        method: 'PUT'
    });
};