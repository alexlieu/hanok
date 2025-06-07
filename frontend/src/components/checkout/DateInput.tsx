import { useEffect, useState } from "react";

const getFirstValidDate = () => {
  const firstValidDate = new Date();
  firstValidDate.setDate(firstValidDate.getDate() + 3);
  return firstValidDate;
};

const getLastValidDate = () => {
  const lastValidDate = new Date();
  lastValidDate.setMonth(lastValidDate.getMonth() + 2);
  return lastValidDate;
};

const formatDateString = (date: Date) => {
  return date.toISOString().split("T")[0];
};

type DateInputProps = {
  onDateChange: (pickupDate: string) => void;
};

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    getFirstValidDate()
  );

  useEffect(() => {
    onDateChange(getFirstValidDate().toISOString());
  }, [onDateChange]);

  const handleDateSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.currentTarget.value;
    if (dateString) {
      setSelectedDate(new Date(dateString));
      onDateChange(new Date(dateString).toISOString());
    } else {
      setSelectedDate(null);
      onDateChange("");
    }
  };
  return (
    <div>
      <input
        type="date"
        id="pickup-date"
        name="pickup-date"
        value={selectedDate ? formatDateString(selectedDate) : ""}
        min={formatDateString(getFirstValidDate())}
        max={formatDateString(getLastValidDate())}
        onChange={handleDateSelection}
      />
    </div>
  );
};

export default DateInput;
