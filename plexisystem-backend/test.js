// test.js - prosty test
console.log('Starting test...');

try {
  const express = require('express');
  console.log('✓ Express loaded');
  
  const cors = require('cors');
  console.log('✓ CORS loaded');
  
  const nodemailer = require('nodemailer');
  console.log('✓ Nodemailer loaded');
  
  const sqlite3 = require('sqlite3');
  console.log('✓ SQLite3 loaded');
  
  const { v4: uuidv4 } = require('uuid');
  console.log('✓ UUID loaded');
  
  const axios = require('axios');
  console.log('✓ Axios loaded');
  
  require('dotenv').config();
  console.log('✓ Dotenv loaded');
  
  console.log('\n✅ All modules loaded successfully!');
  console.log('PORT:', process.env.PORT || 3001);
  
} catch (error) {
  console.error('❌ Error loading module:', error.message);
  console.error('Missing module:', error.code);
}