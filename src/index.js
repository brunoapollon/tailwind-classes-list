const ClassListProcessorService = require("./classListProcessor");
const DesignSystemService = require("./designSystem");

async function geClassList({ param, limit }) {
  const designSystemService = new DesignSystemService();
  const classListProcessorService = new ClassListProcessorService();

  await designSystemService.loadDesignSystem()
  const tailwindState = {
    enabled: true,
    separator: ':',
    variants: designSystemService.variants,
    classList: designSystemService.classList,
    designSystem: designSystemService.designSystem,
  };

  return classListProcessorService.process(tailwindState, param, limit);
}

module.exports = { geClassList } 
