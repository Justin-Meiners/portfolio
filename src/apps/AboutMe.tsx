import ImageSlot from '../components/ImageSlot'

const skillGroups = [
  { category: 'Languages', skills: ['Python', 'C', 'Java', 'JavaScript', 'TypeScript'] },
  { category: 'Full-Stack', skills: ['React', 'Node.js', 'FastAPI', 'PostgreSQL'] },
  { category: 'Developer Tools', skills: ['Git', 'Docker', 'AWS'] },
  { category: 'Databases', skills: ['MongoDB', 'NoSQL', 'Neo4j', 'DynamoDB']}
  
]

export default function AboutMe() {
  return (
    <div className="about-me">
      <div className="about-me-summary">
        <ImageSlot
          src="/assets/profile-photo.png"
          alt="Photo of Justin"
          width={120}
          height={120}
        />

        <div className="about-me-text">
          <p style={{ marginTop: 0 }}>
            Hi, I'm Justin, a senior at UT Austin studying Computer Science.
          </p>
          <p style={{ marginBottom: 0 }}>
            I like building things I find cool, whether it's fun web applications or interesting software projects.
            I've worked with various programming languages and frameworks, including Python, React, and C, along with
            other tools, such as Git, Docker, and AWS. I've worked with AI technologies as well, ranging from
            simple API integrations to more complex interactive applications. If you're interested in learning more
            about what I've done, check out my projects folder or reach out! <br /><br />

            When I'm not working on school, projects, or other commitments, I enjoy spending time with my cats, friends, and family.
            I like to read books, watch movies, play video games, and explore new places.
            Other than that, I'm always down to bowl a few frames. <br /><br />

            If you have any questions or just want to chat, feel free to reach me at 6justin14@gmail.com.

          </p>
        </div>
      </div>

      <section className="skills-section" aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills &amp; Tools</h2>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <fieldset key={group.category} className="skill-group">
              <legend>{group.category}</legend>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </fieldset>
          ))}
        </div>
      </section>
    </div>
  )
}
