import { useState } from 'react'
import Select from 'react-select';
import countries from 'world-countries';
import '../App.css'
import '../InputPage.css';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


const FormPage = () => {
    const navigate = useNavigate();
    const textLine = "あなたにとっての「かわいい」は？ To you, what does 'cute' mean?";

    const letters = Array.from(textLine); // Split the text into individual letters

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('date', formData.date);
        data.append('gender', formData.gender);
        data.append('age', formData.age);
        data.append('text', formData.answer);
        if (formData.imageFile) {
            data.append('imageFile', formData.imageFile);
        }

        try {
            await fetch('http://ec2-98-83-117-130.compute-1.amazonaws.com/api/submit', {
                method: 'POST',
                body: data,
            });
            alert('Data submitted successfully!');
            navigate('/result');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ margin: 'auto', padding: '20px 40px', borderRadius: '25px', justifyContent: 'center', textAlign: 'center' }}>
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="animated-text"
                style={{ fontSize: "24px", fontWeight: "bold", display: "flex", flexWrap: "wrap", margin: '10px' }}
            >
                {letters.map((char, index) => (
                    <motion.span key={index} variants={child}>
                        {char === " " ? "\u00A0" : char} {/* Handle spaces */}
                    </motion.span>
                ))}
            </motion.div>
            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left', padding: '10px', borderRadius: '5px' }}>

                    {/* Name input */}
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
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
                                    width: 317
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
                                    width: 317
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
                                    width: 317
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
                            placeholder="「かわいい」は？/ What is cute to you ?"
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
        </div>
    )
}

export default FormPage