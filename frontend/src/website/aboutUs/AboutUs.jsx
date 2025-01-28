import React from "react";
import Hero from "../../components/website/hero/Hero";
import image from "../../assets/hero.jpg";
import aboutus_image from "../../assets/photo-141.jpg";
import collect_image from "../../assets/photo-093.jpg";
import facil_image from "../../assets/photo-094.jpg";
import mission_image from "../../assets/photo-110.jpg";

const AboutUs = () => {
  return (
    <div className="bg text__color">
      <Hero
        title="Introduction"
        text={
          "Established in 1924, the Vajiraramaya Library stands as a beacon of Buddhist scholarship and learning. Founded under the guidance of the esteemed Most Venerable Pelene Siri Vajirajana Maha Nayaka Thera, the library has been an integral part of the Siri Vajiraramaya Temple in Colombo. Over the decades, it has served as a vital resource for monks, scholars, and laypersons alike, fostering a deeper understanding of Buddhist teachings and Sri Lankan heritage. The library’s serene environment offers a tranquil space for study and reflection, embodying the temple’s commitment to the dissemination of knowledge and the preservation of sacred texts."
        }
        image={aboutus_image}
        reverse={true}
      />

      <Hero
        title="Mission"
        text={
          "The Vajiraramaya Library is dedicated to preserving and promoting Buddhist literature and related disciplines. Our mission is to provide access to a comprehensive collection of texts that support the study and practice of Buddhism. We aim to serve as a center for learning, where individuals can deepen their understanding of the Dhamma and its application in daily life. Through our resources and services, we strive to uphold the temple’s tradition of education and spiritual development, contributing to the growth of an informed and compassionate community."
        }
        image={mission_image}
      />

      <Hero
        title="Collection"
        text={
          "Our library boasts an extensive collection of over 8,000 books and 210 Ola leaf manuscripts, some of which are exceedingly rare. The collection encompasses works in Pali, Sanskrit, Burmese, Sinhala, and English, covering a wide range of topics including Buddhist philosophy, history, and culture. Notably, the library houses publications by renowned resident monks such as Ven. Narada and Ven. Piyadassi, whose teachings have reached audiences worldwide. This diverse assemblage of texts makes the Vajiraramaya Library a valuable repository of Buddhist knowledge and a testament to the temple’s scholarly heritage."
        }
        image={collect_image}
        reverse={true}
      />

      <Hero
        title="Access / Facilities"
        text={
          "The Vajiraramaya Library is open to all individuals seeking knowledge and spiritual growth. Visitors can explore our collection in a peaceful and contemplative setting conducive to study and reflection. While the primary focus is on serving the monastic community and lay practitioners, we also welcome researchers and scholars interested in Buddhist studies. To ensure the preservation of our rare and delicate materials, certain items may require special handling or prior arrangement for access. We encourage visitors to contact us ahead of their visit to learn more about our services, operating hours, and any guidelines in place to protect our valuable collections."
        }
        image={facil_image}
      />
    </div>
  );
};

export default AboutUs;
