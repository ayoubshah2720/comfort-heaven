import Image from "next/image";
import Link from "next/link";
import {
  SITE_NAME,
  SOCIAL_FACEBOOK_URL,
  SOCIAL_INSTAGRAM_URL,
  SOCIAL_LINKEDIN_URL,
  SOCIAL_X_URL,
  STORE_FULL_ADDRESS,
  STORE_PHONE_DISPLAY,
} from "@/constants";

const img = {
  footerBg: "/__footerBg.png",
  sofa: "/__sofa.png",
  qrCode: "/qrCode.png",
  googlePlay: "/googlePlay.png",
};

const socialLinks = [
  {
    label: "Facebook",
    href: SOCIAL_FACEBOOK_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: SOCIAL_INSTAGRAM_URL,
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
    href: SOCIAL_X_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKEDIN_URL,
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
      <div className="pp-footer-bg">
        <Image src={img.footerBg} alt="" fill style={{ objectFit: "cover" }} sizes="100vw" unoptimized />
      </div>

      <div className="pp-footer-dark-top" />
      <div className="pp-footer-dark-bot" />

      <div className="pp-footer-sofa">
        <Image src={img.sofa} alt="Sofa" fill style={{ objectFit: "contain", objectPosition: "bottom right" }} sizes="367px" unoptimized />
      </div>

      <div className="pp-footer-content">
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
            <p className="cursor-pointer">{SITE_NAME} Delivery</p>
            <Link href="/contact-us">Contact Us</Link>
          </div>
        </div>

        <div className="pp-contact-box">
          <div className="pp-contact-inner">
            <h4>CONTACT US</h4>
            <div className="pp-contact-divider" />
            <div className="pp-contact-info">
              <span>{STORE_PHONE_DISPLAY}</span>
              <span>{STORE_FULL_ADDRESS}</span>
            </div>
          </div>
        </div>

        <div className="pp-footer-bottom">
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
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="17.1654" height="16.1739" fill="#111827" />
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

          <p className="pp-copyright">Copyright © 2024 {SITE_NAME} | All Right Reserved.</p>
        </div>
      </div>
    </div>
  );
}
