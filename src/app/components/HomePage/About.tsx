import Link from "next/link";
import React from "react";

const About = () => {
  return (
      <div className="mx-auto max-w-screen-xl px-4  sm:px-6  lg:px-8 ">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          {/* about image */}
          <div
            data-aos="fade-top"
            data-aos-duration="1600"
            data-aos-easing="ease-in-out-back"
            className="relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1"
          >
            <img src="./about.png" alt="" />

            <div className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-10%] md:right-[-7%] lg:right-[10%]">
              <img src="./about-card.png" alt="" />
            </div>
          </div>

          {/* about content */}
          <div
            data-aos="fade-down"
            data-aos-duration="1600"
            data-aos-easing="ease-in-out-back"
            className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2"
          >
            <h2 className="heading"> Proud to be one of the nations best</h2>
            <p className="text_para">
              For 30 years in a row, U.S News & World Report has recognized us
              as one of the best publics hospitals in the Nation and #1 in
              Texas. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Quas, nemo?
            </p>

            <p className="text_para mt-[30px]">
              Our best is something we strive for each day, caring for our
              patients-not looking back at what we accomplished but towards what
              we can do tomorrow. Providing the best. Lorem ipsum dolor sit amet
              consectetur, adipisicing elit. Quas, nemo?
            </p>

            <Link href="/">
              <button className="btn mt-[38px]">Learn more</button>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default About;
