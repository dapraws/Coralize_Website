<div align="center">

![Coralize](docs/screens/01-hero.jpg)

# Coralize

**An augmented-reality field guide to coral reefs, by team Biorookie.**

[Live site](https://coralize.pages.dev) · [TestFlight](https://testflight.apple.com/join/YVCv7bSz)

</div>

Coralize turns printed postcards into 3D coral in augmented reality. This is the website that goes with the iOS app: an introduction to the app and its cards, an interactive 3D coral encyclopedia, and a tribute to Biorock Indonesia.

<p align="center">
  <img src="docs/demo.gif" width="70%" alt="3D coral encyclopedia">
</p>

<table>
  <tr>
    <td width="36%"><img src="docs/screens/02-cards.jpg" alt="Cards"></td>
    <td width="36%"><img src="docs/screens/04-biorock.jpg" alt="Biorock"></td>
    <td width="28%" align="center">
      <img src="docs/screens/m1-hero.jpg" width="62" alt="Mobile hero">
      <img src="docs/screens/m2-encyclopedia.jpg" width="62" alt="Mobile encyclopedia">
    </td>
  </tr>
</table>

---

## Team

<table>
  <tr>
    <td align="center" valign="top" width="20%">
      <img src="docs/team/pelangi.png" width="130" alt="Pelangi"><br>
      <b>Pelangi</b><br>
      Project Manager / Designer<br>
      <sub>Product Designer</sub><br>
      <a href="https://linkedin.com/in/pelangi-romadoni-a12075254/"><img src="docs/icons/linkedin.svg" width="20" alt="LinkedIn"></a>&nbsp;
      <a href="https://github.com/pelangiromadoni222"><img src="docs/icons/github.svg" width="20" alt="GitHub"></a>
    </td>
    <td align="center" valign="top" width="20%">
      <img src="docs/team/kae.png" width="130" alt="Kae"><br>
      <b>Kae</b><br>
      Developer<br>
      <sub>AI Engineer</sub><br>
      <a href="https://linkedin.com/in/teresakae/"><img src="docs/icons/linkedin.svg" width="20" alt="LinkedIn"></a>&nbsp;
      <a href="https://github.com/teresakae"><img src="docs/icons/github.svg" width="20" alt="GitHub"></a>
    </td>
    <td align="center" valign="top" width="20%">
      <img src="docs/team/fitra.png" width="130" alt="Fitra"><br>
      <b>Fitra</b><br>
      Developer<br>
      <sub>Game Developer</sub><br>
      <a href="https://linkedin.com/in/fitraramadhans/"><img src="docs/icons/linkedin.svg" width="20" alt="LinkedIn"></a>&nbsp;
      <a href="https://github.com/fnt4sia"><img src="docs/icons/github.svg" width="20" alt="GitHub"></a>
    </td>
    <td align="center" valign="top" width="20%">
      <img src="docs/team/frans.png" width="130" alt="Frans"><br>
      <b>Frans</b><br>
      3D Artist<br>
      <sub>Industrial Engineer</sub><br>
      <a href="https://linkedin.com/in/fransiskus-risky-gawahi-a00202310/"><img src="docs/icons/linkedin.svg" width="20" alt="LinkedIn"></a>&nbsp;
      <a href="https://github.com/gawahirisky24-netizen"><img src="docs/icons/github.svg" width="20" alt="GitHub"></a>
    </td>
    <td align="center" valign="top" width="20%">
      <img src="docs/team/darrel.png" width="130" alt="Darrel"><br>
      <b>Darrel</b><br>
      3D Artist<br>
      <sub>Software Engineer</sub><br>
      <a href="https://linkedin.com/in/dapraws"><img src="docs/icons/linkedin.svg" width="20" alt="LinkedIn"></a>&nbsp;
      <a href="https://github.com/dapraws"><img src="docs/icons/github.svg" width="20" alt="GitHub"></a>
    </td>
  </tr>
</table>

---

## Built with

| Technology | What it does here |
|---|---|
| **React 19 + TypeScript** | The interface, written as typed components. |
| **Vite** | Dev server and production build. |
| **Tailwind CSS 4** | Styling, with Instrument Serif and JetBrains Mono as the type pairing. |
| **three.js, React Three Fiber, drei** | The interactive 3D coral viewers: orbit controls, lighting and model loading. |
| **GSAP** | Slide transitions, entrance animation and the parallax reef in the hero. |
| **Custom show controller** | Runs the full-screen display mode: auto-play, keyboard and trackpad stepping, and an idle reset. |
| **Cloudflare Pages** | Hosting. |

3D models are compressed with meshopt (61MB down to 23MB) and the lighting is bundled with the site, so the 3D views work without any external requests. Below 900px the slide show becomes a normal scrolling page.

## Run locally

```bash
npm install
npm run dev
```
