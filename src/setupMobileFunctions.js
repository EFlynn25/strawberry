import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Dialog } from '@capacitor/dialog';

import { add_device } from './socket.js';
import mainStore from './redux/mainStore.js';

const showAlert = async (message) => {
  await Dialog.alert({
    title: 'Push notifications',
    message: message,
  });
};

export async function setupPushNotifications() {
  try {
    await addListeners();
    await registerNotifications();
    // await getDeliveredNotifications();
  } catch (exception_var) {
    console.log(exception_var);
  }
}

const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
    const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(myTimezone);
    add_device(token.value, myTimezone);
  });

  await PushNotifications.addListener('registrationError', err => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    console.log('Push notification received', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

const registerNotifications = async () => {
  PushNotifications.requestPermissions().then(async (result) => {
    if (result.receive === 'granted') {
      PushNotifications.register();
    } else {
      await showAlert("Permissions were denied. You will not receive notifications.");
    }
  });
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
}
