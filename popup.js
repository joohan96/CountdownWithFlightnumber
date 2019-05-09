// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', onclick, false)

  function validateForm() {
    var a = document.getElementById("returnDate").value;
    var b = document.getElementById("flightNumber").value;
    if (a == null || a == "", b == null || b == "") {
      alert("All fields must be filled!!!");
      return false;
    } else {
      return true;
    }
  }

  function onclick() {
    if (validateForm()) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const countDownDate = document.getElementById("returnDate").value;
        const flightNumber = document.getElementById("flightNumber").value;
        const arr = [countDownDate, flightNumber];
        chrome.tabs.sendMessage(tabs[0].id, arr, setMessage)
      })
    }
  }

  function setMessage(res) {
    const div = document.createElement('div')
    div.textContent = `${res.msg}`
    document.body.appendChild(div)
  }
}, false)