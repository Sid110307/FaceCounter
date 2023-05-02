# FaceCounter

> A program that counts the number of faces detected by the webcam.

## Desktop version

### Requirements

- Python 3.6 or higher
- OpenCV 4.1.0 or higher

### Installation

- Clone the repository

```bash
$ git clone https://github.com/Sid110307/FaceCounter.git
# Cloning into 'FaceCounter'...
```

- Install the requirements

```bash
$ pip install -r requirements.txt
# Collecting opencv-python...
```

- Run the program (**Note:** The shell scripts automatically resolve dependencies)

```bash
# Linux/MacOS
$ ./run.sh
# Windows
$ run.bat
```

### Usage

- Press `q` to quit the program
- The program will automatically log the day's face count to a CSV file in the format `FaceCounter_<date>_<month>_<year>.csv`.
- Environment variables:
  - WEBCAM: The index of the webcam to use. Defaults to 0.
  - CASCADE: The path to the cascade file to use. Defaults to the built-in Haar Cascade.
