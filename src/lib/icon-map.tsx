import { Icons } from "@/components/icons";
import {
  faReact,
  faNodeJs,
  faJava,
  faJsSquare,
  faHtml5,
  faCss3,
  faGitAlt,
  faCss3Alt,
  faBootstrap,
  faPython,
  faDocker,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase, faLeaf, faServer } from "@fortawesome/free-solid-svg-icons";

// Skills are stored in the backend as a plain string key (e.g. "react") so
// the API has no dependency on FontAwesome's React components. This maps
// that key back to the actual icon definition for rendering.
export const skillIconMap: Record<string, import("@fortawesome/fontawesome-svg-core").IconDefinition> = {
  html5: faHtml5,
  css3: faCss3,
  javascript: faJsSquare,
  java: faJava,
  react: faReact,
  nodejs: faNodeJs,
  express: faServer,
  mongodb: faLeaf,
  mysql: faDatabase,
  sql: faDatabase,
  tailwindcss: faCss3Alt,
  bootstrap: faBootstrap,
  git: faGitAlt,
  python: faPython,
  docker: faDocker,
};

// Social links / project links reference an icon by key from the Icons map.
export const linkIconMap: Record<string, keyof typeof Icons> = {
  github: "github",
  linkedin: "linkedin",
  x: "x",
  email: "email",
  globe: "globe",
};

export function getSocialIcon(key: string) {
  return Icons[linkIconMap[key] ?? "globe"];
}
