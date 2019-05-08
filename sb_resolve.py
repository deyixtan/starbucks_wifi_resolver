from datetime import datetime
import requests
import subprocess
import time


'''
MADE BY: DE YI <https://github.com/deyixtan>
'''


def valid_ssid(ssid="MyRepublic@Starbucks"):
    try:
        if ssid in str(subprocess.check_output("netsh wlan show interfaces", shell=False)):
            return True
        return False
    except:
        return False


# dummy default hostname to test connection
def is_connection_alive(hostname="stackoverflow.com"):
    try:
        response = str(subprocess.check_output(f"ping -n 1 {hostname}", shell=False))
        if "Destination net unreachable" not in response:
            return True
        return False
    except:
        return False


def establish_connection():
    try:
        s = requests.Session()
        payload = {
            "username": 'dsuser',
            "password": "dspass",
            "dst": "http://www.starbucks.com.sg/"
        }

        s.post("http://sb.login.org/login", data=payload)
        return True
    except:
        return False


def main(interval_check=30, retry_count=5, timeout=3):
    while True:
        # check ssid
        if not valid_ssid:
            print(f"{datetime.now().strftime('%H:%M:%S')} - Please connect to Starbucks Wifi access point.")
            return
        else:
            # check connection
            connection_live = is_connection_alive()
            if not connection_live:
                # attempt to establish connection
                for i in range(retry_count):
                    print(f"{datetime.now().strftime('%H:%M:%S')} - Establishing connection attempt #{str(i+1)}/{str(retry_count)}.")
                    establish_connection()
                    time.sleep(timeout)

                    # verify connection status
                    connection_live = is_connection_alive()
                    if connection_live:
                        print(f"{datetime.now().strftime('%H:%M:%S')} - Re-established lost connection.")
                        break
                    
                    # failed all attempts, exit
                    if (i >= retry_count-1):
                        print(f"{datetime.now().strftime('%H:%M:%S')} - Failed all attempts, program is exiting...")
                        return

        time.sleep(interval_check)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
