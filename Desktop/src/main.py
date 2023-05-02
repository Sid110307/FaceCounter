"""
FaceCounter

A program that counts the number of faces detected by the webcam and logs the data to a CSV file.
Environment variables:
    WEBCAM: The index of the webcam to use. Defaults to 0.
    CASCADE: The path to the cascade file to use. Defaults to the built-in Haar Cascade.
"""

# pylint: skip-file

import os
from csv import writer
from datetime import datetime, timedelta

import cv2


class FaceCounter:
    def __init__(self):
        try:
            self.cap = cv2.VideoCapture(os.environ.get("WEBCAM", 0))
        except Exception as e:
            print(f"Unable to open webcam: {e}")
            exit(1)

        self.face_cascade = cv2.CascadeClassifier(
            os.environ.get("CASCADE", cv2.data.haarcascades + "haarcascade_frontalface_default.xml"))  # noqa
        self.face_count = 0
        self.total_faces = 0

        self.csv_file = None
        self.csv_writer = None

        self.previous_time = datetime.now()

    def run(self):
        self.create_csv()
        cv2.namedWindow("FaceCounter", cv2.WINDOW_GUI_NORMAL)

        counter = 0
        while True:
            ret, frame = self.cap.read()
            if not ret:
                print("Unable to capture video.")
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            cv2.putText(frame, f"Faces Detected: {len(faces)}", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            cv2.imshow("FaceCounter", frame)
            self.face_count = len(faces)

            counter += 1
            if counter == 10:
                current_time = datetime.now()

                if current_time - self.previous_time >= timedelta(seconds=1):
                    self.total_faces += self.face_count
                    self.csv_writer.writerow(
                        [datetime.now().strftime("%I:%M:%S.%f")[:-3] + datetime.now().strftime(" %p"), self.face_count])

                    self.previous_time = current_time
                counter = 0

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        self.csv_writer.writerow(["Total", self.total_faces])
        self.cleanup()

    def create_csv(self):
        self.csv_file = open(f"FaceCounter_{datetime.now().strftime('%d_%M_%Y')}.csv", "a", newline="")

        self.csv_writer = writer(self.csv_file)
        self.csv_writer.writerow(["Time", "Faces"])

    def cleanup(self):
        self.cap.release()
        self.csv_file.close()

        print(f"Total faces detected: {self.total_faces}.")
        print(f"CSV log saved to {os.path.abspath(self.csv_file.name)}.")
        cv2.destroyAllWindows()


if __name__ == "__main__":
    print("Starting FaceCounter... Press 'q' to quit.")
    FaceCounter().run()
