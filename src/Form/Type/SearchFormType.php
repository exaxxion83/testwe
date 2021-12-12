<?php


namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;


class SearchFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $data = $options['data'];

        $builder
            ->setAction($data['action'])
            ->add('movie', TextType::class, [
                'attr' =>  [
                    'placeholder' => 'enter movie'
                ],
                'required' => false
            ])
            ->add('actor', ChoiceType::class, [
                'choices' => [null => 'undefined'] + $this->setKeysWithValues($data['actorList']),
            ])
            ->add('type', ChoiceType::class, [
                'choices' => [null => 'undefined'] + $this->setKeysWithValues($data['typeList']),
            ])
            ->add('search', SubmitType::class, ['label' => 'Search movie']);
    }

    private function setKeysWithValues($array)
    {
        return array_combine($array, $array);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'actorList' => [],
            'typeList' => [],
            'action' => ''
        ]);
    }
}