import Constants from 'expo-constants'
import * as Permission from 'expo-permissions'

class UserPermission {
    getCameraPermission = async () => {
        if (Constants.platform.android)
        {
            const { status } = await Permission.askAsync(Permission.CAMERA_ROLL);
            if (status != "granted")
            {
                alert("We need permission your camera roll");
            }
        }
    }
}

export default new UserPermission();