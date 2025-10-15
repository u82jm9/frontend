function GoogleCalendar() {

  return (
    <div className="google-calendar">
      <h1>Google Calendar</h1>
      <div className="google-calendar-display">
        <iframe src="https://calendar.google.com/calendar/embed?height=700&wkst=2&ctz=Europe%2FLondon&showPrint=0&hl=en_GB&showTitle=0&showTz=0&src=am9zaC5tY2N1bGxvY2guMDlAYWJlcmRlZW4uYWMudWs&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%237986cb&color=%230b8043" style={{ "border-width": "0", width: "700px", height: "700px", frameborder: "0", scrolling: "no" }}></iframe>
      </div>
    </div>
  );
}

export default GoogleCalendar;