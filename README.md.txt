What your project does?

Answer:-BioFit 3D is a portable and compact soft-insert contouring device designed to solve the limitations that arise when integrating soft liners with modern 3D-printed prosthetic sockets. While 3D printing has enabled rapid, precise, and patient-specific socket fabrication, the contouring of EVA, foam, or Ethaflex inserts still depends on bulky and expensive equipment such as vacuum formers and hot-air ovens, especially since 3D-printed sockets do not use traditional POP molds. This creates accessibility challenges for small clinics and low-resource environments and reduces the efficiency gained from digital manufacturing. BioFit 3D eliminates these barriers by providing a handheld, cost-effective device that can sterilize the socket using controlled heated airflow while also precisely shaping soft inserts directly onto the 3D-printed socket. Through IoT-enabled temperature and pressure monitoring with ESP32 sensors and cloud integration, the device ensures accurate, safe, and repeatable contouring without the need for POP molds or conventional machinery. Overall, BioFit 3D enhances hygiene, comfort, and usability for amputees while making 3D-printed prosthetic workflows far more practical and accessible.

Problem statement & solution features

Answer:-Compact and Portable Soft Insert Contouring Device for 3D-Printed Prosthetic Socket. 
Solution features:- 1. Portable & Compact Soft Insert Contouring Device

A portable, lightweight device that replaces bulky equipment like vacuum formers and hot-air ovens, making soft-insert contouring possible in small clinics, workshops, or even field settings.

 2. Direct Contouring on 3D-Printed Sockets

Soft inserts such as EVA, Ethaflex, or foam can be shaped directly on the 3D-printed prosthetic socket, eliminating the need for POP molds and streamlining the workflow.

 3. Controlled Heated Airflow Technology

Uses ceramic heating elements with regulated 1–2 bar pressurized airflow to provide uniform heating for safe, accurate, and repeatable insert contouring.

 4. Built-In Sterilization Capability

The same heating–airflow system disinfects and sterilizes the prosthetic socket, removing bacteria, sweat, and odor to improve user hygiene and prevent skin infections.

 5. IoT-Enabled Smart Monitoring

With ESP32 + DS18B20 + BMP280, the device tracks:

 Temperature
 Pressure
 Sterilization cycles
 Operating status

Data streams to cloud platforms like ThingSpeak for real-time monitoring and safety.

 6. Cost-Effective Alternative to Conventional Machines

Replaces expensive vacuum forming machines and ovens with a low-cost, portable solution, making prosthetic care more affordable and accessible.

 7. Enhanced Patient Comfort & Fit

Accurately contoured soft inserts improve cushioning, reduce pressure points, and provide a better-fitting socket for amputees.

 8. Improved Clinical Workflow Efficiency

Removes the need for POP molds, reduces fabrication time, and fits seamlessly into modern digital prosthetic fabrication processes.

 9. Safe & User-Friendly Operation

Features controlled heating, airflow limits, ergonomic design, and sensor-based safety mechanisms—usable by clinicians without specialized training.

Technologies used:-
 Heated airflow system
 Ceramic heating coil
 IoT-based monitoring
 ESP32 controller
 DS18B20 temperature sensing
 ThingSpeak cloud logging
 Pneumatic air delivery
 Safety control electronics

Steps to install and run
 Assemble device and secure connections
 Upload ESP32 code and set WiFi
 Configure ThingSpeak channel
 Power on and preheat the system
 Start airflow for shaping/sterilization
 Place socket or insert in heating zone
 Monitor temperature via ThingSpeak
 Turn off and let the device cool
 
Any required enviourement variable
 WiFi SSID – Name of the WiFi network for ESP32 connectivity
 WiFi Password – Password for the WiFi network
 ThingSpeak Write API Key – For uploading data to the ThingSpeak cloud
 Target Temperature – Desired heating temperature for contouring/sterilization
 Heating Duration – Time period for which the heater runs
 Airflow Control Settings – Air compressor or pump speed/pressure settings
 Safety Limits – Maximum temperature cutoff for safe operation

---------------------------------------------------------------------------------------------------

Steps to clone ---
1. Make a Directory 
2. git clone https://github.com/gargsuryansh/AayushYantra_SIH25147.git
3. cd directory Name
4.Run npm install
5.Run npm run build
6.Run npm run start

