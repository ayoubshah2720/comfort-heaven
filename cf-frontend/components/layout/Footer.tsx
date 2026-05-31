import Image from "next/image";
import Link from "next/link";

const img = {
  footerBg: "/__footerBg.png",
  sofa: "/__sofa.png",
  qrCode: "/qrCode.png",
  googlePlay: "/googlePlay.png",
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <div className="pp-footer">
      {/* Background image */}
      <div className="pp-footer-bg">
        <Image src={img.footerBg} alt="" fill style={{ objectFit: "cover" }} sizes="100vw" unoptimized />
      </div>

      {/* Dark overlays */}
      <div className="pp-footer-dark-top" />
      <div className="pp-footer-dark-bot" />

      {/* Sofa — desktop only */}
      <div className="pp-footer-sofa">
        <Image src={img.sofa} alt="Sofa" fill style={{ objectFit: "contain", objectPosition: "bottom right" }} sizes="367px" unoptimized />
      </div>

      {/* All content */}
      <div className="pp-footer-content">

        {/* Text columns */}
        <div className="pp-footer-cols">
          <div className="pp-footer-col">
            <h4>SERVICES</h4>
            <div>

              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
            <div>

              <Link href="/terms-and-conditions">Term &amp; Conditions</Link>
            </div>
            <div>
              <Link href="/replacement-and-retrieval-policy">Replacement &amp; Retrieval Policy</Link>
            </div>
          </div>
          <div className="pp-footer-col">
            <h4>OUR PRODUCTS</h4>
            <p className="cursor-pointer">Indoor Furniture</p>
            <p className="cursor-pointer">Decorative Items</p>
            <p className="cursor-pointer">Room Furniture</p>
            <p className="cursor-pointer red">Dont miss it</p>
            <p className="cursor-pointer yellow">New Arrivals</p>
          </div>
          <div className="pp-footer-col">
            <h4>ABOUT US</h4>
            <p className="cursor-pointer">Projects</p>
            <p className="cursor-pointer">News</p>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <p className="cursor-pointer">Furniture Shop Delivery</p>
            <Link href="/contact-us">Contact Us</Link>
          </div>
        </div>

        {/* Contact box */}
        <div className="pp-contact-box">
          <div className="pp-contact-inner">
            <h4>CONTACT US</h4>
            <div className="pp-contact-divider" />
            <div className="pp-contact-info">
              <span>062-2502660</span>
              <span>Innovation Heights Complex, Bahawalpur</span>
            </div>
          </div>
        </div>

        {/* Bottom: social + app/QR + copyright */}
        <div className="pp-footer-bottom">

          {/* Social icon links */}
          <div className="pp-social">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="pp-social-btn"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="pp-app-qr">
            <div className="pp-app-section">
              <div>
                <h5>
                  <strong>Exclusive</strong>
                  <span> deals &amp; Offers!</span>
                </h5>
              </div>

              <div className="flex flex-row gap-2">
                <div className="pp-aqr">
                  <svg width="93" height="92" viewBox="0 0 93 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="92.5324" height="92" fill="white" />
                    <path d="M16.0925 16H38.7227V38.5H16.0925V16ZM76.4398 16V38.5H53.8095V16H76.4398ZM53.8095 57.25H61.353V49.75H53.8095V42.25H61.353V49.75H68.8964V42.25H76.4398V49.75H68.8964V57.25H76.4398V68.5H68.8964V76H61.353V68.5H50.0378V76H42.4944V61H53.8095V57.25ZM61.353 57.25V68.5H68.8964V57.25H61.353ZM16.0925 76V53.5H38.7227V76H16.0925ZM23.6359 23.5V31H31.1793V23.5H23.6359ZM61.353 23.5V31H68.8964V23.5H61.353ZM23.6359 61V68.5H31.1793V61H23.6359ZM16.0925 42.25H23.6359V49.75H16.0925V42.25ZM34.951 42.25H50.0378V57.25H42.4944V49.75H34.951V42.25ZM42.4944 23.5H50.0378V38.5H42.4944V23.5ZM8.54914 8.5V23.5H1.00574V8.5C1.00574 6.51088 1.80049 4.60322 3.21515 3.1967C4.62981 1.79018 6.5485 1 8.54914 1L23.6359 1V8.5H8.54914ZM83.9832 1C85.9838 1 87.9025 1.79018 89.3171 3.1967C90.7318 4.60322 91.5266 6.51088 91.5266 8.5V23.5H83.9832V8.5H68.8964V1H83.9832ZM8.54914 68.5V83.5H23.6359V91H8.54914C6.5485 91 4.62981 90.2098 3.21515 88.8033C1.80049 87.3968 1.00574 85.4891 1.00574 83.5V68.5H8.54914ZM83.9832 83.5V68.5H91.5266V83.5C91.5266 85.4891 90.7318 87.3968 89.3171 88.8033C87.9025 90.2098 85.9838 91 83.9832 91H68.8964V83.5H83.9832Z" fill="black" />
                  </svg>
                </div>
                <div>
                  <div className="pp-app-btns">
                    <div className="pp-app-btn">
                      <div>
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                          <rect width="17.1654" height="16.1739" fill="url(#pattern0_1039_875)" />
                          <defs>
                            <pattern id="pattern0_1039_875" patternContentUnits="objectBoundingBox" width="1" height="1">
                              <use xlinkHref="#image0_1039_875" transform="matrix(0.00195312 0 0 0.00207286 0 -0.0306518)" />
                            </pattern>
                            <image id="image0_1039_875" width="512" height="512" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                          </defs>
                        </svg>

                      </div>
                      <div className="pp-app-btn-text">
                        <small>GET IT ON</small>
                        <span>Google Play</span>
                      </div>
                    </div>
                    <div className="pp-app-btn">
                      <Image src={img.googlePlay} alt="App Store" width={16} height={16} unoptimized />
                      <div className="pp-app-btn-text">
                        <small>DOWNLOAD ON THE</small>
                        <span>App Store</span>
                      </div>
                    </div>
                    <div className="pp-app-btn">
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16.5524" height="16.1739" rx="4" fill="#FF5100" />
                        <path d="M3.24707 2.69531C3.32636 3.84768 4.05581 6.23376 6.3393 6.55913C8.52421 6.87046 11.2682 6.71395 12.4985 4.88167C12.8804 4.31293 13.0409 3.59085 12.7616 2.69531" stroke="white" />
                        <path d="M3.9016 10.8281V12.9131H3.5596V12.0011H2.5786V12.9131H2.2366V10.8281H2.5786V11.7221H3.5596V10.8281H3.9016ZM4.69083 10.8281V12.1571C4.69083 12.3151 4.73183 12.4341 4.81383 12.5141C4.89783 12.5941 5.01383 12.6341 5.16183 12.6341C5.31183 12.6341 5.42783 12.5941 5.50983 12.5141C5.59383 12.4341 5.63583 12.3151 5.63583 12.1571V10.8281H5.97783V12.1511C5.97783 12.3211 5.94083 12.4651 5.86683 12.5831C5.79283 12.7011 5.69383 12.7891 5.56983 12.8471C5.44583 12.9051 5.30883 12.9341 5.15883 12.9341C5.00883 12.9341 4.87183 12.9051 4.74783 12.8471C4.62583 12.7891 4.52883 12.7011 4.45683 12.5831C4.38483 12.4651 4.34883 12.3211 4.34883 12.1511V10.8281H4.69083ZM7.68012 12.4871H6.80712L6.65712 12.9131H6.30012L7.04712 10.8251H7.44312L8.19012 12.9131H7.83012L7.68012 12.4871ZM7.58412 12.2081L7.24512 11.2391L6.90312 12.2081H7.58412ZM11.2299 10.8281L10.6119 12.9131H10.2249L9.78692 11.3351L9.32192 12.9131L8.93792 12.9161L8.34692 10.8281H8.70992L9.14192 12.5261L9.60992 10.8281H9.99392L10.4289 12.5171L10.8639 10.8281H11.2299ZM11.854 11.1041V11.7161H12.574V11.9951H11.854V12.6341H12.664V12.9131H11.512V10.8251H12.664V11.1041H11.854ZM13.4272 10.8281V12.9131H13.0852V10.8281H13.4272Z" fill="white" />
                      </svg>

                      <div className="pp-app-btn-text">
                        <small>Explore it on</small>
                        <span>AppGallery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="pp-copyright">
            Copyright © 2024 Furniture Shop | All Right Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
