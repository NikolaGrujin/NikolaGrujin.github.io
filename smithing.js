import * as THREE from 'three';

export class Billet
{
    constructor(type, deform_coeff, base_hardness, max_temp, colors, width, height, length)
    {
        this.type = type;
        this.deform_coeff = deform_coeff;
        this.hardness = base_hardness;

        this.width = width;
        this.height = height;
        this.length = length;

        this.temp = 21;
        this.max_temp = max_temp;

        this.colors = colors;

        this.material = new THREE.MeshStandardMaterial();
        this.geometry = new THREE.BufferGeometry();
    }

    //Heating method for changing temperature of billet
    heat(delta_temp)
    {
        //Increment temperature property
        this.temp += delta_temp;
        let seq_alpha = this.temp / this.max_temp;
        let index = 0;

        for(let i = 0; i < this.colors.length - 1; i++)
        {
            if(this.colors[i][1] <= seq_alpha && this.colors[i+1][1] >= seq_alpha)
            {
                index = i;
            }
        }

        let lerp_alpha = (seq_alpha - this.colors[index][1]) / (this.colors[index+1][1] - this.colors[index][1]);
        this.material.color.lerpColors(this.colors[index][0], this.colors[index+1][0], lerp_alpha);
    }

    quench()
    {
        //TODO: implement quenching
    }
}