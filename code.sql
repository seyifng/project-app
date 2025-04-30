USE sp25_entergalactic_coders;

CREATE TABLE BookedSlots (
  booked_slot_id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  service_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  FOREIGN KEY (provider_id) REFERENCES Users(user_id),
  FOREIGN KEY (service_id) REFERENCES Service(service_id)
);



COMMIT;