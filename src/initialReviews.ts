const data: Review[] = [
  {
    author_name: 'Isaac Schaefer',
    author_url: 'https://www.google.com/maps/contrib/111543393245567706310/reviews?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu1xM6ysFjOgblnIp_kMz9BduL6XVhZ2I-Ldq_G-=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'Highly Recommend!',
  },
  {
    author_name: 'Sean Gray',
    author_url:
      'https://www.google.com/maps/contrib/111543393245567706310/reviews/@47.2775262,-122.4747651,11z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ACNPEu-VYlNiKA-Eaq3bUuqKQzgRbgPpjF6Sv0yrA4Mi=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'Had a crew from Insulation Northwest come in to do an attic project and found mold in the attic. I was told that I would need to clean this before my attic insulation project could be done. Within 15 minutes I got a call from PURaFOG owner Dean who had a crew out to my house within 2 hours. They cleaned and removed the mold the same day and for a very reasonable price. Great company! Family owned and operated. The technicians were both sons of the owner and were very nice, efficient, and professional. I highly recommend this company.',
  },
  {
    author_name: 'Kim Force',
    author_url: 'https://www.google.com/maps/contrib/100167593654597238363/reviews?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu1Ng6OT42Nq6n-zQ43o3VRkJLwXz-xa_4ec876g=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'PURaFOG is a new business in Topeka, Kansas.  Read reviews and was very impressed how awesome they were. I had my 2 story house done plus the basement there has been a  noticeable difference in air quality, air is cleaner and have even been sleeping better! The technician was very nice and informative. Thank you PURaFOG.',
  },
  {
    author_name: 'Sherry Holl',
    author_url:
      'https://www.google.com/maps/contrib/113334474609446283392/reviews/@47.1785899,-122.7477085,17z/data=!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu2Wk3HlPzbDSw4I_7B8hG1Q5h849sDKnRY6pqfU=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'Very happy with their professional job from beginning to completion\nThank You',
  },
  {
    author_name: 'Matthew Vickery',
    author_url:
      'https://www.google.com/maps/contrib/109607862271685557947/reviews/@47.4579612,-122.9228565,8z/data=!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ACNPEu-QRkET_RYEs8RKAM8jWRv7bZjBagx-Yoql4AHteQ=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: "Shannon was fantastic to work with.   She helped us to maximize the sale of our home and find us just the house we wanted.   She’s thoughtful, professional, thorough, attentive, and just an all around great person. She's definitely our realtor for life.",
  },
  {
    author_name: 'Travis Gates',
    author_url: 'https://www.google.com/maps/contrib/109357477965628855104/reviews?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu0G2FWu7BCzoIjwK8zwiB01eqJggxFmENxYiWgC=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'What an amazing company! We hired them to fog the attics and remove all mold at our apartment complexes. They were very timely at getting us on their schedule. Showed up exactly when they said they were going to and made quick work of all our 15 buildings. They were very informative of what the were doing and why. They explained everything they were doing and why right from the initial walk through. These guys are a small family owned and operated company. And they were the nicest people I have ever had the pleasure of working with. From the owner to the technicians doing the work. If you have mold or any other sanitation issues give them a call they will take care of you. And at a reasonable price. We will continue to use pure fog for all our needs. These guys are a total class act and second to none in their industry. THANK YOU PURE FOG FOR YOUR AMAZING SERVICE!!!!',
  },
  {
    author_name: 'Alexa Woodrum',
    author_url:
      'https://www.google.com/maps/contrib/111039724406479359518/reviews/@47.1785899,-122.7477085,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu2sIKHawGMAfjCddOM_GY4KCta9eUph3pCnawyl=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'I was in the process of buying a house and our inspector noticed mold in the attic, this is my first purchase,  I had no idea what to do or how to get rid of it, until I found PURaFOG . PURaFOG was so amazing! They answered their phone even though I called later in the night, they were so patient and helped me understand their process and answerd all my questions,  I felt so comfortable and relieved to know that PURaFOG was going to take care of my mold issue. Thank you so much PURaFOG!',
  },
  {
    author_name: 'Hannah Thompson',
    author_url:
      'https://www.google.com/maps/contrib/101589328191587820309/reviews/@47.1200957,-122.5982924,11z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu0hkOY9PDlCj44FFSWOlPt6zn41jEjSWL5GWR8CXHU=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: '',
  },
  {
    author_name: 'Romy Mandig',
    author_url:
      'https://www.google.com/maps/contrib/108946316806455467647/reviews/@47.1113927,-122.8044099,12z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu1ErOYfPYvcQDMuk1boqVIuIQRn8QHn_h5RfucQ=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'I had a mold in my rental property. Call them and they fix the problem. Highly recommended',
  },
  {
    author_name: 'Armstrong Construction',
    author_url:
      'https://www.google.com/maps/contrib/104371233855455731885/reviews/@44.8995593,-102.8965763,5z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu2sC-i6PT1qgUlqBkBJRcrx5jniTC_DB0fNr0G9=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: "PURaFOG is our go to mold remediation company. Lisa is great to work with and has a process that's just awesome with no demo.",
  },
  {
    author_name: 'Stephanie Whittle',
    author_url:
      'https://www.google.com/maps/contrib/107397129891771209270/reviews/@47.253925,-122.5980686,12z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a-/ACNPEu_UdoCIcdrVKHP35sIdLKNdQW-cLeBuHnr6XoLoDg=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: '',
  },
  {
    author_name: 'Lillian Kelly',
    author_url:
      'https://www.google.com/maps/contrib/107306593685682778281/reviews/@47.2182635,-122.5963814,12z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu3vXIIipVx-8n26nu0yuAlnF0LEsOZwgcvwUKmh=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: 'Had really bad mold in the apartment I was living in, I kept getting very bad headaches and kept feeling sick in the morning. I called them, and they were at my house the same day to get rid of the mold. They were very professional, and friendly. That next morning I instantly felt better, and my house was mold free. I would highly recommend this company !',
  },
  {
    author_name: 'Donna Pontius',
    author_url:
      'https://www.google.com/maps/contrib/100672909240666177401/reviews/@47.1785899,-122.7477085,17z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu2_gnp7tFon5JVDzDMdZZCc4bwSRKBIUVH4_DP0=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: '',
  },
  {
    author_name: 'Bill Boogye',
    author_url: 'https://www.google.com/maps/contrib/106867422318890501716/reviews?hl=en-US',
    relative_time_description: '',
    profile_photo_url:
      'https://lh3.googleusercontent.com/a/ALm5wu2YSkHsghPwSkq0Oi-R6KSKAWz4P81RvVpWNjh-=w60-h60-p-rp-mo-br100',
    rating: 5,
    text: "My eyes had been itching and burning since I moved into my apartment and I couldn't understand why. But then one day i happen to notice black mold growing in my bedroom window! I called PURaFOG and they were out later that same day! They were so professional and efficient! The next day I totally noticed a difference...no more itchy eyes!",
  },
];

export default data;
