
export default function Home() {
  return (
    <main className="bg-gray-50">
      {/* <HeaderHomePage /> */}
      <div className="p-20 bg-gray-800 text-white">
        <p className="text-center">Thực hiện bởi nhóm The Start</p>
        <p className="text-center mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
        <p className="text-center mt-4">
          Liên hệ chúng tôi qua:{" "}
          <a href="curanest.nursingcare@gmail.com" className="text-blue-400">
            curanest.nursingcare@gmail.com
          </a>
        </p>
        <p className="text-center mt-4">
          Theo dõi chúng tôi trên:
          <a
            href="https://www.facebook.com/CuraNest.nursingcare"
            className="ml-2 text-blue-400"
          >
            Facebook
          </a>{" "}
          |
          <a
            href="https://www.instagram.com/curanest24/"
            className="ml-2 text-blue-400"
          >
            Instagram
          </a>
        </p>
      </div>
    </main>
  );
}
