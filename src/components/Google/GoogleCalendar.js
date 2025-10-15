function GoogleCalendar() {

  return (
    <div className="google-calendar">
      <div className="google-calendar-title">
        <h1>Google Calendar</h1>
        <h3>Click below to add an event to your Google Calendar!</h3>
        <a target="_blank" href="https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=NDBmZ3BkZWZ1MGIzY2luaDRrMjNxcDNrdTUgam9zaC5tY2N1bGxvY2guMDlAYWJlcmRlZW4uYWMudWs&amp;tmsrc=josh.mcculloch.09%40aberdeen.ac.uk"><img border="0" src="https://calendar.google.com/calendar/images/ext/gc_button1_en-GB.gif" alt="Google Calendar" /></a>
      </div>
      <div className="google-calendar-display">
        <iframe src="https://calendar.google.com/calendar/embed?height=700&wkst=2&ctz=Europe%2FLondon&showPrint=0&hl=en_GB&showTitle=0&showTz=0&src=am9zaC5tY2N1bGxvY2guMDlAYWJlcmRlZW4uYWMudWs&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%237986cb&color=%230b8043" style={{ "border-width": "0", width: "700px", height: "700px", frameborder: "0", scrolling: "no" }}></iframe>
      </div>
    </div>
  );
}

export default GoogleCalendar;