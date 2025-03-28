// Script to generate placeholder images for projects
document.addEventListener('DOMContentLoaded', function() {
  // Project themes and colors
  const projects = [
    { name: 'RAG Bot', color: '#6e56cf', secondaryColor: '#31c4be' },
    { name: 'Blog2Tweet Agent', color: '#ff6347', secondaryColor: '#ffd700' },
    { name: 'Blogen', color: '#4169e1', secondaryColor: '#32cd32' }
  ];

  // Generate static images
  projects.forEach((project, index) => {
    generateStaticImage(project, index + 1);
  });

  console.log('Image placeholders generated. You can save them manually from the browser.');
});

function generateStaticImage(project, index) {
  // Create canvas for static image
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 340;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 340);
  gradient.addColorStop(0, project.color);
  gradient.addColorStop(1, project.secondaryColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 340);
  
  // Add some geometric shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(150, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.rect(400, 50, 150, 150);
  ctx.fill();
  
  // Add project name
  ctx.font = 'bold 40px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(project.name, 300, 180);
  
  // Add placeholder text
  ctx.font = '20px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('AI Project Demonstration', 300, 220);
  
  // Add download link for each image
  canvas.toBlob(function(blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `project${index}.jpg`;
    link.textContent = `Download ${project.name} Image`;
    link.style.display = 'block';
    link.style.marginBottom = '10px';
    document.body.appendChild(link);
  });
  
  // Create simple animated GIF-like effect using multiple canvases
  const animCanvas = document.createElement('canvas');
  animCanvas.width = 600;
  animCanvas.height = 340;
  document.body.appendChild(animCanvas);
  
  const animCtx = animCanvas.getContext('2d');
  
  // Draw base layer similar to static image
  animCtx.fillStyle = gradient;
  animCtx.fillRect(0, 0, 600, 340);
  
  // Add project name
  animCtx.font = 'bold 40px "Space Grotesk", sans-serif';
  animCtx.fillStyle = 'white';
  animCtx.textAlign = 'center';
  animCtx.fillText(project.name, 300, 180);
  
  // Add "Live Demo" text
  animCtx.font = 'bold 24px "Space Grotesk", sans-serif';
  animCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  animCtx.fillText('Live Demo', 300, 220);
  
  // Add animated effect instructions
  animCtx.font = '16px "Space Grotesk", sans-serif';
  animCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  animCtx.fillText('This would be an animated GIF in production', 300, 250);
  animCtx.fillText('showing the project in action', 300, 270);
  
  // Add animated particles
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * 600,
      y: Math.random() * 340,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 1 + 0.5
    });
  }
  
  function drawParticles() {
    // Clear previous frame
    animCtx.fillStyle = gradient;
    animCtx.fillRect(0, 0, 600, 340);
    
    // Draw particles
    particles.forEach(particle => {
      animCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      animCtx.beginPath();
      animCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      animCtx.fill();
      
      // Move particles
      particle.y -= particle.speed;
      
      // Reset particles that go off screen
      if (particle.y < -10) {
        particle.y = 350;
        particle.x = Math.random() * 600;
      }
    });
    
    // Redraw text
    animCtx.font = 'bold 40px "Space Grotesk", sans-serif';
    animCtx.fillStyle = 'white';
    animCtx.textAlign = 'center';
    animCtx.fillText(project.name, 300, 180);
    
    animCtx.font = 'bold 24px "Space Grotesk", sans-serif';
    animCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    animCtx.fillText('Live Demo', 300, 220);
    
    animCtx.font = '16px "Space Grotesk", sans-serif';
    animCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    animCtx.fillText('This would be an animated GIF in production', 300, 250);
    animCtx.fillText('showing the project in action', 300, 270);
  }
  
  // Animate the GIF placeholder
  let frameCount = 0;
  const animationInterval = setInterval(() => {
    drawParticles();
    frameCount++;
    
    if (frameCount > 100) {
      clearInterval(animationInterval);
      
      // Add download link for the GIF placeholder
      animCanvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `project${index}.gif`;
        link.textContent = `Download ${project.name} GIF Animation`;
        link.style.display = 'block';
        link.style.marginBottom = '30px';
        document.body.appendChild(link);
      });
    }
  }, 50);
} 