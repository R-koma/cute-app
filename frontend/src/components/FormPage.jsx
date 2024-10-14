import { useState, useRef, useEffect } from 'react'
import Select from 'react-select';
import countries from 'world-countries';
import '../App.css'
import '../InputPage.css';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const getRandomBrightColor = () => {
    const r = Math.floor(Math.random() * 128 + 128);
    const g = Math.floor(Math.random() * 128 + 128);
    const b = Math.floor(Math.random() * 128 + 128);
    return `rgb(${r}, ${g}, ${b})`;
};

const FormPage = () => {
    const navigate = useNavigate();
    let textLine = "あなたにとっての「かわいい」は？";
    textLine += " To you, what does 'cute' mean?";

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

        const base64Image = await convertImageToBase64(formData.image);
        const data = {
            name: formData.name,
            date: formData.date,
            gender: formData.gender,
            age: formData.age,
            country: formData.country,
            text: formData.answer,
            image: base64Image, 
        };

        axios.post("http://ec2-98-83-117-130.compute-1.amazonaws.com/api/cutiees", data)
        .then((res) => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })


    
        // try {
        //     await fetch('', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json', // Set the appropriate content type
        //         },
        //         body: JSON.stringify(data), // Convert data object to JSON
        //     });
        //     alert('Data submitted successfully!');
           navigate('/result');
        // } catch (error) {
        //     console.error('Error:', error);
        // }
    };
    
    // Helper function to convert image to Base64
    const convertImageToBase64 = (file) => {
        if (!file) {
            return "";
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // Resolve the promise with the Base64 string
            };
            reader.onerror = (error) => {
                reject(error); // Reject the promise in case of an error
            };
            reader.readAsDataURL(file); // Read the image file as a data URL (Base64)
        });
    };

    const cloudsRef = useRef([]);
    useEffect(() => {
        const animateCloud = (cloud) => {
            let position = 0;
            const speed = 1;
            const direction = Math.random() < 0.5 ? 1 : -1;
            const move = () => {
                position += speed * direction;
                if (position > window.innerWidth) {
                    position = -100;
                } else if (position < -100) {
                    position = window.innerWidth;
                }
                cloud.style.transform = `translateX(${position}px)`;
                requestAnimationFrame(move);
            };
            move();
        };
        cloudsRef.current.forEach(cloud => animateCloud(cloud));
        const createBalloon = () => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            const balloonColor = getRandomBrightColor(); // ランダムな色を生成
            balloon.style.backgroundColor = balloonColor; // 風船の色を設定
            balloon.style.left = Math.random() * 100 + 'vw';
            balloon.style.bottom = '-100px';
            document.querySelector('.balloons-container').appendChild(balloon);
            const balloonString = document.createElement('div');
            balloonString.className = 'balloon-string';
            balloon.appendChild(balloonString);
            // 結び目の色を風船の色と同じにする
            const knot = document.createElement('div');
            knot.className = 'balloon-knot';
            knot.style.backgroundColor = balloonColor; // 結び目の色を設定
            balloon.appendChild(knot);
            const moveBalloon = () => {
                let currentBottom = parseFloat(balloon.style.bottom);
                balloon.style.bottom = currentBottom + 2 + 'px';
                if (currentBottom > window.innerHeight + 100) {
                    balloon.remove();
                } else {
                    requestAnimationFrame(moveBalloon);
                }
            };
            moveBalloon();
        };
        const balloonInterval = setInterval(createBalloon, 2000);
        return () => {
            clearInterval(balloonInterval);
        };
    }, []);

    return (
        <div style={{ display: "flex", margin: 'auto', padding: '20px 40px', borderRadius: '25px', justifyContent: 'center', textAlign: 'center' }}>
            <div className="balloons-container">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="animated-text"
                    style={{ fontSize: "24px", fontWeight: "bold", display: "flex",  flexWrap: "wrap", margin: '10px',  writingMode: 'horizontal-tb', direction: 'ltr' } }
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
                                style={{
                                    width: '300px', padding: '8px', border: '2px solid #9c9c9c',
                                    borderRadius: '5px',
                                    outline: 'none',
                                }}
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
                                        width: 317,
                                        border: '2px solid #9c9c9c',
                                        borderRadius: '5px',
                                        outline: 'none',
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
                                        width: 317,
                                        border: '2px solid #9c9c9c',
                                        borderRadius: '5px',
                                        outline: 'none',
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
                                        width: 317,
                                        border: '2px solid #9c9c9c',
                                        borderRadius: '5px',
                                        outline: 'none',
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
                                    border: '2px solid #9c9c9c',
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
                                style={{
                                    width: '300px', padding: '8px', 
                                    border: '2px solid #9c9c9c',
                                    borderRadius: '5px',
                                    outline: 'none',
                                }}
                            />
                        </div>


                        {/* Submit button */}
                        <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            {[0, 1, 2].map(index => (
                <div className="cloud" ref={el => cloudsRef.current[index] = el} key={index}></div>
            ))}
        </div>
    )
}

export default FormPage