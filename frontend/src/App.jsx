import { useState } from 'react'
import Select from 'react-select';
import countries from 'world-countries';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    answer: '',
    country: '',
    name: '',
    age: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      country: selectedOption.value
    });
  };

  const handleAgeChange = (selectedOption) => {
    setFormData({
      ...formData,
      age: selectedOption.value
    });
  };

  const handleGenderChange = (selectedOption) => {
    setFormData({
      ...formData,
      gender: selectedOption.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file && file.size > maxSize) {
      alert('File size exceeds 5 MB. Please upload a smaller file.');
      return;
    }

    setFormData({
      ...formData,
      image: file
    });
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common
  }));

  const ageOptions = Array.from({ length: 20 }, (_, i) => {
    const start = i * 10 + 1;
    const end = start + 9;
    return {
      value: `${start}-${end}`,
      label: `${start}-${end}`
    };
  });

  return (
    <>
      <div>
        <h2>あなたにとっての「かわいい」は？</h2>
        <h3>{`To you, what does 'cute' mean?`}</h3>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left', padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>

          {/* Name input */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '300px', padding: '8px' }}
            />
          </div>

          {/* Age dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <Select
              name="age"
              placeholder="Select your age range"
              options={ageOptions}
              onChange={handleAgeChange}
              value={ageOptions.find(option => option.value === formData.age)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: 300
                })
              }}
            />
          </div>

        {/* Gender dropdown */}
        <div style={{ marginBottom: '10px' }}>
          <Select
            name="gender"
            placeholder="Select your gender"
            options={genderOptions}
            onChange={handleGenderChange}
            value={genderOptions.find(option => option.value === formData.gender)}
            styles={{
              control: (provided) => ({
                ...provided,
                width: 300
              })
            }}
          />
        </div>

          {/* Country dropdown */}
          <div style={{ marginBottom: '10px' }}>
            <Select
              name="country"
              placeholder="Select your country"
              options={countryOptions}
              onChange={handleCountryChange}
              value={countryOptions.find(option => option.value === formData.country)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: 300
                })
              }}
            />
          </div>

          {/* Image upload with size limit */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                width: '300px',
                padding: '8px',
                border: '1px solid #3f3f3f',
                borderRadius: '5px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>



          {/* Text, picture, or drawing */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="answer"
              placeholder="(text, picture, drawing)"
              value={formData.answer}
              onChange={handleChange}
              style={{ width: '300px', padding: '8px' }}
            />
          </div>


          {/* Submit button */}
          <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default App
